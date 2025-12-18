import { useCallback, useEffect, useRef } from "react";

export function useWaitingUnmount() {
  const resolverRef = useRef<null | VoidFunction>(null);

  useEffect(() => {
    return () => {
      resolverRef.current?.();
      resolverRef.current = null;
    };
  }, []);

  return useCallback(() => {
    return new Promise<void>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);
}