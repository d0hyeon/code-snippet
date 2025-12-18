# react-query

## createQueryFragment

두개 이상의 데이터를 가진 리스트에서 하나의 항목에 변경이 발생할 때 전체가 리렌더 되는데,  
변경된 항목만 리렌더가 발생되어야 할때 유용합니다.  
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
  const { data: user, update } = useUserItem(props.id);

  return (
    <div>
      <Input
        value={user.name}
        onChange={(event) => {
          update({ ...user, name: event.target.value });
        }}
      />
    </div>
  );
}
```
