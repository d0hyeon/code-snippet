
# PathParams
 `/api/users/:userId` 와 같이 동적의 값(variable)이 path에 주입 되어야 하는 문제를 해결합니다. (동적 패스)

 ## 세부사항
 1. Path를 받아 variable을 추론합니다. 위 예시의 경우 추론되는 variable은 `{ userId: string | number }` 입니다. 
 2. Path에 variable를 주입합니다. `Ex) pathParams.serialize(path, variable);`
 3. (next.js) `useRouter` 의 `push` 와 `replace`에 값(variable)이 주입되지 않은 동적 패스가 있을 경우 컴파일 에러를 발생시킵니다.
 4. (react-router-dom) `useNavigate()` 에 값(variable)이 주입되지 않은 동적 패스가 있을 경우 컴파일 에러를 발생시킵니다.


 ## Example

 ### Simple Example
 ```ts
 import { GeneratePathVariablePattern, PathValue } from "./types";

const PATH_VARIABLE_PATTERN = ':';
export type PathVariables<Path extends string> = GeneratePathVariablePattern<Path, typeof PATH_VARIABLE_PATTERN>;

function serialize<Path extends string>(path: Path, variables: PathVariables<Path>) {
  return Object.entries(variables).reduce((acc, [key, variable]) => {
    const regexp = new RegExp(`${PATH_VARIABLE_PATTERN}${key}`, 'g');

    return acc.replace(regexp, (variable as PathValue).toString());
  }, path as string) as Serialized<Path>;
}

export const pathParams = {
  /**
   * @example
   * pathParams.serialize('/search/:keyword', { keyword: 'name' });
   *  => '/search/name'
   */
  serialize,
};

// 굳이 없어도 됨
type ReplaceAll<Value extends string, From extends string, To extends string> =
  Value extends `${infer Head}${From}${infer Tail}`
  ? `${Head}${To}${ReplaceAll<Tail, From, To>}`
  : Value
export type Serialized<Path extends string> = keyof PathVariables<Path> extends string
  ? ReplaceAll<Path, `${typeof PATH_VARIABLE_PATTERN}${keyof PathVariables<Path>}`, string>
  : string;


 ```
 ### Multiple Example
 ```tsx
 import { GeneratePathVariablePattern, PathValue } from "./types";

type Pattern = Readonly<[string, string]>;
type MergePathVariablePatterns<
  Path extends string,
  Patterns extends ReadonlyArray<Pattern>
> = Patterns extends [infer First extends Pattern, ...infer Rest extends ReadonlyArray<Pattern>]
  ? GeneratePathVariablePattern<Path, First[0], First[1] extends string ? First[1] : ''> & MergePathVariablePatterns<Path, Rest>
  : Record<never, never>;

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
```
