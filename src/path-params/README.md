
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
pathParams.serialize('/users/:userId', {  });
// ❌ ts error ('userId' 속성이 '{}' 형식에 없지만 'Record<"userId", PathValue>' 형식에서 필수입니다.)
pathParams.serialize('/users/:userId', { userId: 1 });
// ✅ /users/1
 ```
 ### Multiple Example
 ```tsx
const PATH_VARIABLE_PATTERN = {
   DEFAULT: createPattern(':', ''), // => '/users/:userId' 
   FOR_NEXT_ROUTE: createPattern('[', ']') // => '/users/[userId]'
};

const pathParams = generatePathParamPattern(
   PATH_VARIABLE_PATTERN.DEFAULT,
   PATH_VARIABLE_PATTERN.FOR_NEXT_ROUTE
);

const apiRoute = pathParams.serialize('/api/users/:userId', { userId: 1 }); // '/api/users/1'
const pageRoute = pathParams.serialize('/users/[userId]', { userId: 1 }); // '/users/1'
```
