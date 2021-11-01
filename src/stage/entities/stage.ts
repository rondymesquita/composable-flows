export interface StageContainer {
  handler: (...params: any[]) => any
  when?: () => boolean
}

export interface StageContainerShort {
  [name: string]: (...params: any[]) => any
}

export type Stage = Function | StageContainer
