


export class WorkerBuilder {
  static fromModule<Payload extends any, ReturnValue extends any>(
    module: (...args: Payload[]) => ReturnValue,
    options?: WorkerOptions
  ) {
    const code = `
        self.addEventListener('message', event => {
          const result = (${module.toString()})(${module.length > 1 ? '...event.data' : 'event.data'});
          
          self.postMessage(result);
        });
      `.trim();

    const blob = new Blob([code]);
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url, options);
    const originTerminate = worker.terminate;

    worker.terminate = () => {
      originTerminate.call(worker);
      URL.revokeObjectURL(url);
    }

    return worker;
  }
}

const worker = WorkerBuilder.fromModule(
  (value: number) => (value * 2).toString(),
)