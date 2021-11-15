type StageFunction = (...params: any[]) => any
export interface StageContainer {
  [name: string]: StageFunction
}

export type Stage = StageFunction | StageContainer
