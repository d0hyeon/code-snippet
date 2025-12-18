# usePerformanceState

상태에서 실제로 참조하는 요소를 추적하여, 참조된 값에 변경 되었을때만 리렌더를 발생시켜줍니다.  
전역 상태를 관리할 때 유용합니다.

## 세부사항

1. 객체 상태만 지원됩니다.

## Example

```tsx
function Component() {
  const [user, setUser] = usePerformanceState(user);

  return (
    <Stack>
      <Text>{user.name}</Text>
      <input
        onChange={(event) => {
          // phone을 업데이트 해도 리렌더는 발생되지 않습니다.
          setUser((prev) => ({ ...user, phone: event.target.value }));
        }}
      />
    </Stack>
  );
}

const userStore = createStore<User>({ name: "홍길동", phone: null });

function UserNameText() {
  const [user, setUser] = useStore(userStore);
  // user.name은 변경되지 않으므로, 리렌더가 발생되지 않습니다.

  return <Text>{user.name}</Text>;
}
function UserPhoneField() {
  const [user, setUser] = useStore(userStore);

  return (
    <input
      value={user.phone}
      onChange={(event) => {
        setUser((prev) => ({ ...user, phone: event.target.value }));
      }}
    />
  );
}
```
