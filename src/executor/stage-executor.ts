import { IStageExecutor } from './istage-executor'
export class StageExecutor implements IStageExecutor {
  async execute(stage: Function, params: any): Promise<any> {
    const stageResult = (await stage(params)) as any
    return stageResult
  }
}
