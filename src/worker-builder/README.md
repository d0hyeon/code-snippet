# WorkerBuilder
- URL로만 생성 가능한 웹 워커 방식을 모듈 방식으로 전환하여 사용할 수 있도록 해줍니다. 

## Example
```ts
// const worker = new Worker('https://s3.worker.js')
const worker = WorkerBuilder.fromModule((value: number) => fibonacci(value));

worker.postMessage(10);
worker.addEventListener('message', event => {
  console.log(event.data)
  // 55
})
```
