import { IStageExecutor } from './istage-executor'
export class StageExecutor implements IStageExecutor {
  async execute(stage: Function, param: any): Promise<any> {
    const stageResult = (await stage(param)) as any
    return stageResult
  }
}
