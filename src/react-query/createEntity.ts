import {
  QueryClient,
  useQueryClient,
  useQuery,
  useSuspenseQuery,
  UseQueryOptions,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from '@tanstack/react-query'

export interface Entity<T, ID extends string | number> {
  name: string
  selectId: (item: T) => ID
  getKey: (id: ID) => readonly [string, ID]
  upsert: (queryClient: QueryClient, item: T) => void
  upsertAll: (queryClient: QueryClient, list: T[]) => void
}


export function createEntity<T>() {
  return function <ID extends string | number>({
    name,
    selectId,
  }: {
    name: string
    selectId: (item: T) => ID
  }): Entity<T, ID> {
    const getKey = (id: ID) => [name, id] as const

    const upsert = (qc: QueryClient, item: T) => {
      const id = selectId(item)

      qc.setQueryData<T>(getKey(id), (old) => {
        if (!old) return item
        return { ...old, ...item }
      })
    }

    const upsertAll = (qc: QueryClient, list: T[]) => {
      list.forEach((item) => upsert(qc, item))
    }

    return {
      name,
      selectId,
      getKey,
      upsert,
      upsertAll,
    }
  }
}

/** =========================
 * createEntityQuery
 * ========================= */


export function createEntityQuery<T, ID extends string | number>(
  entity: Entity<T, ID>,
) {
  function useEntityQuery(options: {
    entityId: ID
  } & Omit<UseQueryOptions<T>, 'queryKey' | 'initialData'>) {
    const qc = useQueryClient()

    return useQuery<T>({
      queryKey: entity.getKey(options.entityId),
      initialData: () => qc.getQueryData<T>(entity.getKey(options.entityId)),
      ...options,
    })
  }

  function useSuspenseEntityQuery(options: {
    entityId: ID
  } & PickRequired<Omit<UseSuspenseQueryOptions<T>, 'queryKey'>, 'queryFn'>) {
    return useSuspenseQuery({
      queryKey: entity.getKey(options.entityId),
      ...options,
    })
  }

  return {
    useEntityQuery,
    useSuspenseEntityQuery,
  }
}

/** =========================
 * createEntityListQuery
 * ========================= */

export function createEntityListQuery<
  T,
  ID extends string | number
>(entity: Entity<T, ID>) {
  function wrapRefetchOption(option: any, qc: QueryClient) {
    if (typeof option === 'function') {
      return (query: any) => {
        const ids: ID[] = query.data || []

        const entities = ids.map((id) =>
          qc.getQueryData(entity.getKey(id))
        )

        return option({
          ...query,
          data: entities,
        })
      }
    }

    return option
  }

  function useEntityIdsQuery(
    options: Omit<UseQueryOptions<ID[]>, 'queryFn'> & {
      queryFn: () => Promise<T[]>
    }
  ) {
    const qc = useQueryClient()

    return useQuery({
      ...options,
      refetchOnWindowFocus: wrapRefetchOption(
        options.refetchOnWindowFocus,
        qc
      ),
      refetchOnReconnect: wrapRefetchOption(
        options.refetchOnReconnect,
        qc
      ),
      refetchOnMount: wrapRefetchOption(
        options.refetchOnMount,
        qc
      ),
      queryFn: async () => {
        const list = await options.queryFn()

        entity.upsertAll(qc, list)

        return list.map(entity.selectId)
      },
    })
  }

  function useSuspenseEntityIdsQuery(
    options: Omit<UseSuspenseQueryOptions<ID[]>, 'queryFn'> & {
      queryFn: () => Promise<T[]>
    }
  ) {
    const qc = useQueryClient()

    return useSuspenseQuery({
      ...options,
      refetchOnWindowFocus: wrapRefetchOption(
        options.refetchOnWindowFocus,
        qc
      ),
      refetchOnReconnect: wrapRefetchOption(
        options.refetchOnReconnect,
        qc
      ),
      refetchOnMount: wrapRefetchOption(
        options.refetchOnMount,
        qc
      ),
      queryFn: async () => {
        const list = await options.queryFn()

        entity.upsertAll(qc, list)

        return list.map(entity.selectId)
      },
    })
  }

  return {
    useEntityIdsQuery,
    useSuspenseEntityIdsQuery,
  }
}

type PickRequired<T, Keys extends keyof T> = Omit<T, Keys> & Required<Pick<T, Keys>>;