# react-query

## createQueryFragment

리스트 형태를 가진 데이터에서 세부 항목에 변경이 발생할 때 전체가 리렌더 되는데, 
변경된 항목만 리렌더가 발생되어야 할때 사용할 수 있습니다.  
리스트와 각 항목의 쿼리를 분리하여 관리합니다.

### Example

```tsx
type User = { id: string; name: string; like: boolean };

const [useUserList, useUserItem] = createQueryFragment<User>({
  queryKey: ["/user"],
  queryFn: async () => (await fetch("...")).json(),
  accessorId: "id",
});

function ListPage() {
  // 이 페이지는 두번 다시 렌더링 되지 않습니다.
  const { data: users } = useUserList();

  return (
    <div>
      {users.map((x) => (
        <UserDetail key={x.id} id={x.id} />
      ))}
    </div>
  );
}

function UserDetail(props) {
  const { data: user, update, refetch } = useUserItem(props.id);

  return (
    <div>
      <Input
        value={user.name}
        onChange={(event) => {
          update({ ...user, name: event.target.value });
          refetch();
        }}
      />
    </div>
  );
}
```
