import { IStageExecutor } from './contracts/istage-executor'
export class StageExecutorErrorHandling implements IStageExecutor {
  async execute(
    stage: Function,
    shouldSpreadParams: boolean,
    params: any,
  ): Promise<any> {
    let stageResult: any
    try {
      if (shouldSpreadParams) {
        stageResult = (await stage(...params)) as any
      } else {
        stageResult = (await stage(params)) as any
      }
    } catch (err) {
      console.error(err)
    }
    return stageResult
  }
}
