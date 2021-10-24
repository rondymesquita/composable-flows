import { IStageExecutor } from './istage-executor'
export class StageExecutorErrorHandling implements IStageExecutor {
  async execute(stage: Function, params: any): Promise<any> {
    let stageResult: any
    try {
      stageResult = (await stage(params)) as any
    } catch (err) {
      console.error(err)
    }
    return stageResult
  }
}
