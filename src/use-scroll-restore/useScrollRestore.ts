
import { useEffect, useMemo } from 'react';
import { fromEvent } from 'rxjs';
import { LRUCache } from './LRUCache';

type Options<T> = {
  target?: T;
  restoreKey?: string;
  enabled?: boolean;
};
const scrollCache = new LRUCache();

export function useScrollRestore<T extends HTMLElement>(options?: Options<T>) {
  const restoreKey = useMemo(() => {
    if (options?.restoreKey) return options.restoreKey;
    return location.href;
  }, [options?.restoreKey]);

  useEffect(() => {
    if (!options?.enabled) return;

    const target = options?.target ?? window;
    const value = scrollCache.get<[number, number]>(restoreKey);
    if (value == null) return;

    const [top, left] = value
    target.scrollTo({ top, left });
  }, [restoreKey, options?.enabled, options?.target]);

  useEffect(() => {
    const subscription = fromEvent(options?.target ?? window, 'scrollend').subscribe(() => {
      if (options?.target) {
        return scrollCache.set(restoreKey, [options.target.scrollTop, options.target.scrollLeft]);
      }
      scrollCache.set(restoreKey, [window.scrollY, scrollX]);
    });

    return () => subscription.unsubscribe();
  }, [restoreKey, options?.target, options?.enabled]);
}