
import { useCallback } from 'react';
import { NavigateOptions, Path, To, useNavigate as useRRDNavigate } from 'react-router-dom';

export function useNavigate() {
  const navigate = useRRDNavigate();

  const moveByPath = useCallback(<Next extends To>(to: SafetyTo<Next>, options?: NavigateOptions) => {
    return navigate(to, options);
  }, [navigate]);

  const moveByDelta = useCallback((delta: number) => {
    return navigate(delta);
  }, [navigate]);

  const move = useCallback(<Next>(
    arg1: SafetyTo<Next> | number,
    arg2?: typeof arg1 extends number ? never : NavigateOptions
  ) => {
    if (typeof arg1 === 'number') return moveByDelta(arg1);
    return moveByPath(arg1, arg2);

  }, [moveByPath, moveByDelta])

  return move;
}

type SafetyTo<Next> = Next extends Record<any, any>
  ? Partial<Omit<Path, 'pathname'> & { pathname: SafetyPathname<Next['pathname']> }>
  : Next extends string ? SafetyPathname<Next> : never;

type SafetyPathname<Pathname extends string> = Pathname extends `${string}:${infer Key}/${string}`
  ? PathVariableError<Key>
  : Pathname extends `${string}:${infer Key}`
  ? PathVariableError<Key>
  : Pathname;

type PathVariableError<Key extends string> = `Must be injected value for '${Key}'`;

