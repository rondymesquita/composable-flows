type TypedFunction<I> = (param?: I) => any
type AnyFunction = (...params: any[]) => any
type StageFunction<I> = AnyFunction | TypedFunction<I>
export interface StageContainer<I> {
  [name: string]: StageFunction<I>
}

export type Stage<I> = StageFunction<I> | StageContainer<I>

// type StageFunction<I> = (...params: any[]) => any |
// export interface StageContainer<I> {
//   [name: string]: StageFunction<I>
// }

// export type Stage<I> = StageFunction<I> | StageContainer<I>
