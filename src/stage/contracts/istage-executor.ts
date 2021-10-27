export interface IStageExecutor {
  execute(
    stage: Function,
    shouldSpreadParams: boolean,
    params?: any,
  ): Promise<any>
}
