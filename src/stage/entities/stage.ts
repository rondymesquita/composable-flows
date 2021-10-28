export interface StageContainer {
  handler: () => any
  when?: () => boolean
}

export type Stage = Function | StageContainer
