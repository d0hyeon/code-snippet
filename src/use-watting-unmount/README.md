# useWattingUnmount

컴포넌트가 언마운트 되는 시점의 promise를 반환하는 함수를 제공합니다.  
페이지를 이동하는 상황에서 저성능의 네트워크 속도를 대응할때 유용합니다.

## example

```tsx

function Component() {
  const router = useRouter() // next.js App Dir
  const waitForNextRouteComplete = useWattingUnmount();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      ...

      <CTA
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await sendData('...');
            // 아래 함수가 없을 경우, 네트워크 지연이 발생하는 상황에서 페이지 전환이 되기 전에 CTA의 disabled가 풀려 여러번 클릭을 할 수 있습니다.
            await waitForNextRouteComplete();
          })
        }}
      >
    </>
  )
}

```
