import { UseQueryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

type KeyType = string | number;
type GetId<Item> = (item: Item) => Item[keyof Item];
type Id<Item> = keyof Item | GetId<Item>;


type Fragment<Item extends Record<KeyType, any>> = {
  keys: Item[keyof Item][];
  data: Record<Item[keyof Item], Item>;
};

interface Option<Item extends Record<KeyType, any>> extends Omit<UseQueryOptions<Item[]>, 'select'> {
  accessorId: Id<Item>;
};


export function createQueryFragment<Item extends Record<any, any>>({
  queryKey: baseQueryKey,
  queryFn,
  accessorId,
  ...queryOptions
}: Option<Item>) {

  function useList() {
    const queryClient = useQueryClient();
    const result = useQuery<Item[], Error, Id<Item>[]>({
      queryKey: baseQueryKey,
      queryFn: async (...params) => {
        if (queryFn) {
          const list = await queryFn(...params);

          list.reduce<Id<Item>[]>((acc, item) => {
            const id = typeof accessorId === 'function' ? accessorId(item) : accessorId;
            queryClient.setQueryData(
              [...baseQueryKey, id],
              item,
            )

            return [...acc, id];
          }, [])
        }

        return [];
      },
      ...queryOptions,
    })

    const data = useMemo(() => {
      return result.data?.reduce<Item[]>((acc, key) => {
        const item = queryClient.getQueryData<Item>([...baseQueryKey, key]);
        
        if (item == null) {
          return acc;
        }

        return {
          ...acc,
          [key as string | number]: item,
        }
      }, [])
      
    }, [result.data, queryClient]);

    return { ...result, data }
  }

  function useItem(id: string | number) {
    const queryClient = useQueryClient();
    const queryKey = [...baseQueryKey, id];

    const { data, ...result } = useQuery<Item>({
      queryKey,
      queryFn: async () => { 
        const item = queryClient.getQueryData<Item>(queryKey);
        if (item) return item;

        await queryClient.fetchQuery({ queryKey: baseQueryKey });
        return queryClient.getQueryData(queryKey) as Item;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      refetchOnMount: false,
    });

    const update = useCallback((next: Fragment<Item> | ((prev: Fragment<Item>) => Fragment<Item>)) => {
      queryClient.setQueryData<Fragment<Item>>(queryKey, fragment => {
        if (!fragment) return fragment;

        if (next instanceof Function) {
          return next(fragment);
        }

        return next;
      })
    }, [])

    return { ...result, data, update };
  }



  return [useList, useItem] as const
}