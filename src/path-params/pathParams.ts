import { GeneratePathVariablePattern, PathValue } from "./types";

type PathVariables<Path extends string> = GeneratePathVariablePattern<Path, ':'>;
export const pathParams = {
  serialize: <Path extends string>(path: Path, variables: PathVariables<Path>) => {
    return Object.entries(variables).reduce((acc, [key, value]) => {
      const regexp = new RegExp(`:${key}`, 'g');
      return acc.replace(regexp, (value as PathValue).toString());
    }, path as string);
  },
};
