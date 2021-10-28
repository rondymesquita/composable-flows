export interface StageContainer {
  handler: (...params: any[]) => any
  when?: () => boolean
}

export type Stage = Function | StageContainer
