# useScrollRestore

## 세부사항

페이지 전환 간의 스크롤을 복구합니다.

## Example

```ts
function Component() {
  const ref = useRef(null);

  useScrollRestore({
    target: ref.current,
    restoreKey: "something-contents"
    enabled: ref.current !== null
  });

  useScrollRestore(); // window 스크롤

  return (
    <Scrollable ref={ref}>
      {...}
    </Scrollable>
  )
}
```
