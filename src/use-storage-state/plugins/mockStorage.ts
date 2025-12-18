// SSR 대응용 목 스토리지
export const mockStorage: Storage = {
  getItem: (key: string) => null,
  setItem: (key: string, value: any) => {},
  removeItem: (key: string) => {},
  clear: () => {},
  key: (index: number) => null,
  length: 0,
};