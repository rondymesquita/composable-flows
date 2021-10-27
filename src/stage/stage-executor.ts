import { IStageExecutor } from './contracts/istage-executor'
export class StageExecutor implements IStageExecutor {
  async execute(
    stage: Function,
    shouldSpreadParams: boolean,
    params?: any,
  ): Promise<any> {
    let stageResult: any

    if (shouldSpreadParams) {
      stageResult = (await stage(...params)) as any
    } else {
      stageResult = (await stage(params)) as any
    }
    return stageResult
  }
}
