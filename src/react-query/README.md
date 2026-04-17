# react-query

## createEntity

1. 동일한 엔티티에 서로 다른 캐시 키로 관리 될 경우 동기화 문제가 발생합니다.
2. 리스트 + 단건 업데이트 구조에서, 업데이트 시 모든 row의 리렌더가 발생합니다.

위 두가지 문제를 해결하고자 직렬화를 수행합니다.

### Example

```tsx
type User = { id: string; name: string; };

const userEntity = createEntity<User>()({
  name: 'user',
  selectId: user => user.id
})
const { useEntityIdsQuery } = createEntityListQuery(userEntity)

function ListPage() {
  const { data: userIds } = useEntityIdsQuery({
    queryKey: ['user-all'],
    queryFn: () => fetch(,,,)
  });

  return (
    <Table>
      {users.map((x) => (
        <UserTableRow key={x.id} id={x.id} />
      ))}
    </Table>
  );
}

const { useEntityQuery } = createEntityQuery(userEntity);

function UserTableRow(props) {
  const { data: user, refetch } = useEntityQuery({
    entityId: props.id,
    queryFn: () => fetch(...)
  });

  return (
    <tr>
      <td>
        <Input
          value={user.name}
          onChange={(event) => {
            api.updateName(event.target.value);
            refetch() // 동일한 entityId를 구독하는 컴포넌트만 리렌더링 됩니다.
          }}
        />
      </td>
    </tr>
  );
}
```
