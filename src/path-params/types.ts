export type PathValue = string | number;
export type GeneratePathVariablePattern<
  Path extends string,
  Prefix extends string,
  Postfix extends string = ''
> = Path extends `${string}/${Prefix}${infer Key}${Postfix}/${infer Tail}`
  ? Record<Key, PathValue> & GeneratePathVariablePattern<Tail, Prefix, Postfix>
  : RestPathVariables<Path, Prefix, Postfix>;

type RestPathVariables<
  Path extends string,
  Prefix extends string,
  Postfix extends string | undefined
> =
  Path extends `${string}/${Prefix}${infer LastKey}${Postfix extends string ? Postfix : ' '}`
  ? Record<LastKey, PathValue>
  : Record<never, never>;
