export interface IStageExecutor {
  execute(stage: Function, param: any): Promise<any>
}
