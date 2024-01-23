import { GeneratePathVariablePattern, PathValue } from "./types";

type Pattern = Readonly<[string, string]>;
type MergePathVariablePatterns<
  Path extends string,
  Patterns extends ReadonlyArray<Pattern>
> = Patterns extends [infer First extends Pattern, ...infer Rest extends ReadonlyArray<Pattern>]
  ? GeneratePathVariablePattern<Path, First[0], First[1] extends string ? First[1] : ''> & MergePathVariablePatterns<Path, Rest>
  : Record<never, never>

export function generatePathParamPattern<Patterns extends ReadonlyArray<Pattern>>(...patterns: Patterns) {
  function serialize<const Path extends string>(
    path: Path,
    variables: MergePathVariablePatterns<Path, Patterns>
  ) {
    return Object.entries(variables).reduce((acc, [key, variable]) => {
      const regexps = patterns.map(([prefix, postfix]) => {
        if (postfix == null) {
          return `(\\${prefix}${key})`
        }
        return `(\\${prefix}${key}\\${postfix})`
      });
      const regexp = new RegExp(regexps.join('|'), 'g');

      return acc.replace(regexp, (variable as PathValue).toString());
    }, path as string);
  }

  return { serialize }
}

export function createPattern<Prefix extends string, Postfix extends string>(
  prefix: Prefix,
  postfix: Postfix
): readonly [Prefix, Postfix] {
  return [prefix, postfix] as const;
}