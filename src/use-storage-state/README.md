# useStorageState

브라우저 스토리지와 상태를 동기화합니다.

## example

```tsx
function Component() {
  const [count, setCount] = useStorageState("example-storage1", 0, {
    parse: Number,
    stringify: (value) => value.toString(),
  });

  const [countInToday, setCountInToday] = useStorageState("exampleStorage2", {
    storage: expirableStorage,
    parse: Number,
    stringify: (value) => value.toString(),
  });
  const endOfToday = set(Date.now(), { hour: 23, minute: 23 second: 59 });

  return (
    <>
      <Input
        value={count}
        onChange={(event) => setCount(Number(event.target.value))}
      />

      <Input
        value={countInToday}
        onChange={(event) => {
          setCountInToday(
            Number(event.target.value),
            endOfToday, // 만료일
          );
        }}
      />
    </>
  );
}
```
