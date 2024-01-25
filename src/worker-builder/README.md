# WorkerBuilder
절대 URL로만 웹 워커를 생성해야 하는 허들을 해결합니다.   
단 현재 기준, 워커의 Context를 활용하지 못하고 오직 워커를 모듈 기반 생성 & 메세지를 송수신해주는 브릿지 역할만 수행합니다. 

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
