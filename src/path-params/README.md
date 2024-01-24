
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

type PathVariables<Path extends string> = GeneratePathVariablePattern<Path, ':'>;
const pathParams = {
  serialize: <Path extends string>(path: Path, variables: PathVariables<Path>) => {
    return Object.entries(variables).reduce((acc, [key, value]) => {
      const regexp = new RegExp(`:${key}`, 'g');
      return acc.replace(regexp, (value as PathValue).toString());
    }, path as string);
  },
};

const route = pathParams.serialize('/users/:userId', { userId: 1 }); // '/users/1'
 ```
 ### Multiple Example
 ```tsx
 import { GeneratePathVariablePattern, PathValue } from "./types";

type Pattern = Readonly<[string, string]>;
type MergePathVariablePatterns<
  Path extends string,
  Patterns extends ReadonlyArray<Pattern>
> = Patterns extends [infer Item extends Pattern, ...infer Rest extends ReadonlyArray<Pattern>]
  ? GeneratePathVariablePattern<Path, Item[0], Item[1] extends string ? Item[1] : ''> & MergePathVariablePatterns<Path, Rest>
  : Record<never, never>;

function generatePathParamPattern<Patterns extends ReadonlyArray<Pattern>>(...patterns: Patterns) {
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
};

const DYNAMIC_PATH_PATTERN = {
  DEFAULT: createPattern(':', ''),
  FOR_NEXT_ROUTE: createPattern('[', ']')
};

const pathParams = generatePathParamPattern(
  DYNAMIC_PATH_PATTERN.DEFAULT,
  DYNAMIC_PATH_PATTERN.FOR_NEXT_ROUTE
);

const apiRoute = pathParams.serialize('/api/users/:userId', { userId: 1 }); // '/api/users/1'
const pageRoute = pathParams.serialize('/users/[userId]', { userId: 1 }); // '/users/1'
```
