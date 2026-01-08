type Options = {
  maxSize?: number;
  maxAge?: number;
};

export class LRUCache {
  private storage = new Array<[string, unknown]>();
  private maxSize;
  private maxAge;

  constructor({ maxSize = 50, maxAge = 1000 * 60 * 5 }: Options = {}) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  set<T>(key: string, value: T) {
    if (this.storage.length === this.maxSize) {
      this.removeByAt(this.storage.length - 1);
    }
    this.append(key, value);
    setTimeout(() => this.remove(key), this.maxAge);
  }

  remove(key: string) {
    const index = this.storage.findIndex((item) => item[0] === key);
    if (index === -1) return;

    this.removeByAt(index);
  }

  get<T>(key: string): T | null {
    const index = this.storage.findIndex((item) => item[0] === key);
    if (index === -1) return null;
    const [_, item] = this.storage[index];

    this.removeByAt(index);
    this.append(key, item);
    return item as T;
  }

  private append<T>(key: string, value: T) {
    this.storage.unshift([key, value]);
  }

  private removeByAt(index: number) {
    this.storage = this.storage.slice(0, index).concat(this.storage.slice(index + 1, this.storage.length));
  }
}