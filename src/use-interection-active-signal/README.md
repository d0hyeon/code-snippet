# useInterectionActiveSignal

사용자 인터렉션을 기반으로 활성 상태에 진입할때 콜백 함수가 실행됩니다.

## example

```tsx
const SomethingModule = lazy(() => import("..."));

export default function Page() {
  const currentTab = useCurrentTabValue();

  useInterectionActiveSignal(
    () => {
      SomethingModule.preload();
    },
    { sensivility: "high" },
  );

  return (
    <Container>
      {currentTab === "비동기 컨텐츠" && <SomethingModule />}
    </Container>
  );
}
```

## lazy

React.lazy의 확장된 모듈로, preload 메서드를 제공합니다.
