# react-query

## createQueryFragment 
동일한 엔티티 리스트가 서로 독립된 쿼리 키로 분리되는 경우 엔티티간의 동기화 이슈가 발생할 수 있습니다. 
이러한 문제를 해결하며 엔티티를 Fragment라는 공통된 공간에 위치시키고 각 독립된 쿼리는 이 Fragment를 참조하여 사용합니다.

### Example
```tsx

type User = { id: string; name: string; like: boolean; };

const [useUserFragment, connectUserFragment] = createQueryFragment<User>({
  key: 'id',
  baseQueryKey: ['/user'],
  queryClient,
})

function App () {
  const { data: users } = useSuspenseQuery({
    query: ['/user', filterValues],
    queryFn: () => getUsers(...filterValues),
    select: connectUserFragment
  });

  const { data: userById, setData: setUser } = useUserFragment();
  
  const likeUser = (id: string) => {
    const nextUser = { ...userById[id], like: true };
    
    setUser(prev => ({ ...prev, [id]: nextUser }))
  }

  return (
    ...
  )
}

```