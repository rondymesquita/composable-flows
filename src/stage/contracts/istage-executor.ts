export interface IStageExecutor {
  execute(stage: Function, params: any): Promise<any>
}
