type TypedFunction<I> = (param?: I) => any
type AnyFunction = (...params: any[]) => any
export type StageFunction<I> = AnyFunction | TypedFunction<I>
export interface StageContainer<I> {
  [name: string]: StageFunction<I>
}

export type Stage<I> = StageFunction<I> | StageContainer<I>
