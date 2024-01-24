import { QueryClient, QueryKey, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

type KeyType = string | number;
type GetKey<Item> = (item: Item) => Item[keyof Item];
type Key<Item> = keyof Item | GetKey<Item>;


type Fragment<Item extends Record<KeyType, any>> = {
  keys: Item[keyof Item][];
  data: Record<Item[keyof Item], Item>;
};

interface FragmentOption<Item extends Record<KeyType, any>> {
  key: Key<Item>;
  baseQueryKey: QueryKey;
  queryClient: QueryClient
}


export function createQueryFragment<Item extends Record<any, any>>({
  key,
  baseQueryKey,
  queryClient
}: FragmentOption<Item>) {
  const queryKey = [...baseQueryKey, 'fragment'];

  function useFragment() {
    const { data } = useQuery<Fragment<Item>>({
      queryKey,
      initialData: { data: {}, keys: [] } as unknown as Fragment<Item>,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      refetchOnMount: false,
    });

    const setFragment = useCallback((next: Fragment<Item> | ((prev: Fragment<Item>) => Fragment<Item>)) => {
      queryClient.setQueryData<Fragment<Item>>(queryKey, fragment => {
        if (!fragment) return fragment;

        if (next instanceof Function) {
          return next(fragment);
        }

        return next;
      })
    }, []);

    const setData = useCallback((next: Fragment<Item>['data'] | ((prev: Fragment<Item>['data']) => Fragment<Item>['data'])) => {
      queryClient.setQueryData<Fragment<Item>>(queryKey, fragment => {
        if (!fragment) return fragment;

        if (next instanceof Function) {
          const nextData = next(fragment.data);
          return { ...fragment, data: nextData }
        }

        return { ...fragment, data: next }
      })
    }, [])

    const getFragment = useCallback(() => {
      return queryClient.getQueryData<Fragment<Item>>(queryKey)!
    }, [])

    return { ...data, getFragment, setFragment, setData };
  }

  type KeyValue = Item[keyof Item];
  type Data = Record<KeyValue, Item>;

  function connectFragment(data: Item[]): Item[] {
    const newData = data.reduce((acc, item) => {
      if (key instanceof Function) {
        const keyValue = key(item);
        acc.keys.push(keyValue);
        acc.data[keyValue] = item;

        return acc;
      }

      const keyValue = item[key];
      acc.keys.push(keyValue);
      acc.data[keyValue] = item;

      return acc;
    }, { keys: [] as KeyValue[], data: {} as Data });

    queryClient.setQueryData<Fragment<Item>>(queryKey, (fragment) => {
      if (!fragment) return fragment;

      return {
        keys: [...fragment.keys, ...newData.keys],
        data: { ...fragment.data, ...newData.data }
      };
    });

    const fragment = queryClient.getQueryData<Fragment<Item>>(queryKey);

    return newData.keys.map((key) => fragment!.data[key]);
  }


  return [useFragment, connectFragment] as const
}