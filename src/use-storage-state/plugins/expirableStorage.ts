type ExpirableStorage = Omit<Storage, 'getItem' | 'setItem'> & {
  getItem: <T = string>(key: string) => T | null;
  setItem: (key: string, value: any, expire: number) => void;
};

export const expirableStorage: ExpirableStorage = {
    ...localStorage,
    getItem: <T = string>(key: string): T | null => {
      try {
        const storageValue = localStorage.getItem(key);
        if (storageValue == null) return null;
        const parsed = JSON.parse(storageValue);
        if (!isExpirableValue(parsed)) return null;

        const expiredAt = new Date(parsed.expireAt);
        if (expiredAt.getTime() < Date.now()) {
          localStorage.removeItem(key);
          return null;
        }

        return parsed.value;
      } catch {
        localStorage.removeItem(key);
        return null;
      }
    },
    setItem: (key: string, value: any, expire: number) => {
      const expireAt = Date.now() + expire;
      localStorage.setItem(key, JSON.stringify({ value, expireAt }));
    },
};
  
function isExpirableValue(data: unknown): data is { value: unknown, expireAt: number } { 
  return data instanceof Object && data.hasOwnProperty('value') && data.hasOwnProperty('expireAt');
}
