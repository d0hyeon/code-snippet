import { SetStateAction, useCallback, useMemo, useRef, useState } from "react";

export function usePerformanceState<T extends Record<string | number, any>>(initialState?: T | (() => T)) {
  const [state, setState] = useState(initialState);
  
  const accessedKeys = useRef(new Set());
  const prevStateRef = useRef(state);

  const trackedState = useMemo(() => {
    if (state == null) return state;

    return new Proxy(state, {
      get(target, accessor) {
        if (typeof accessor === 'string') {
          accessedKeys.current.add(accessor);
          return target[accessor];
        }
      }
    })
  }, [state]);

  const setTrackedState = useCallback((next: SetStateAction<T | undefined>) => {
    const nextValue = typeof next === 'function' ? next(prevStateRef.current) : next;

    if (nextValue == null) {
      accessedKeys.current = new Set();
      prevStateRef.current = nextValue;
      setState(nextValue);
      return;
    }

    const nextKeys = Object.keys(nextValue);
    const shouldUpdate = nextKeys
      .filter(key => accessedKeys.current.has(key))
      .some(key => prevStateRef.current?.[key] !== nextValue[key]);

    prevStateRef.current = nextValue;
    if (shouldUpdate) {
      setState(nextValue);
    }
    
  }, [prevStateRef, accessedKeys]);

  return [trackedState, setTrackedState] as const;
}
