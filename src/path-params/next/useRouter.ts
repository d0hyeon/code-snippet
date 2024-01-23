import Router, { useRouter as useNextRouter, } from 'next/router';
import { useCallback, useMemo } from 'react';
import { GeneratePathVariablePattern } from '../types';

interface ParsedUrlQueryInput extends NodeJS.Dict<string | number | boolean | ReadonlyArray<string> | ReadonlyArray<number> | ReadonlyArray<boolean> | null> {
}

interface UrlObject {
  auth?: string | null;
  hash?: string | null;
  host?: string | null;
  hostname?: string | null;
  href?: string | null;
  pathname?: string | null;
  protocol?: string | null;
  search?: string | null;
  slashes?: boolean | null;
  port?: string | number | null;
  query?: string | null | ParsedUrlQueryInput;
}

type Url = UrlObject | string;

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  unstable_skipClientCache?: boolean;
}

export function useRouter() {
  const router = useNextRouter();

  const push = useCallback(<Next extends Url>(url: SaftyUrl<Next>, as?: SaftyUrl<Next>, options?: TransitionOptions): Promise<boolean> => {
    return router.push(url, as, options);
  }, [router]);

  const replace = useCallback(<Next extends Url>(url: SaftyUrl<Next>, as?: SaftyUrl<Next>, options?: TransitionOptions): Promise<boolean> => {
    return router.replace(url, as, options);
  }, [router]);

  return useMemo(() => ({ ...router, push, replace }), [router])
}

type PathVariable<Path extends string> = GeneratePathVariablePattern<Path, '[', ']'>;
type SaftyUrl<Next> = Next extends Record<any, any>
  ? PathVariable<Next['pathname']> extends never
  ? UrlObject
  : ((Omit<UrlObject, 'pathname'> & { pathname?: SafetyPathname<Next['pathname']> }) | (Omit<UrlObject, 'query'> & { query: PathVariable<Next['pathname']> } & { query: ParsedUrlQueryInput }))
  : Next extends string
  ? SafetyPathname<Next>
  : never;

type SafetyPathname<Pathname extends string> = Pathname extends `${string}[${infer Key}]${string}`
  ? PathVariableError<Key>
  : Pathname extends `${string}:${infer Key}`
  ? PathVariableError<Key>
  : Pathname;
type PathVariableError<Key extends string> = `Must be injected value for '${Key}'`;