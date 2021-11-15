import { StageOptions } from './entities/stage-options'
import { StageResult } from './entities/stage-result'
import { Stage } from './entities/stage'
import { IStageExecutor } from './contracts/istage-executor'
export class StageExecutor implements IStageExecutor {
  constructor(private readonly options: StageOptions) {}

  async execute(
    stageFunction: Function,
    shouldSpreadParams: boolean,
    params?: any,
  ): Promise<StageResult> {
    let stageResult: any

    try {
      if (shouldSpreadParams) {
        stageResult = (await stageFunction(...params)) as any
      } else {
        stageResult = (await stageFunction(params)) as any
      }
    } catch (err: any) {
      console.warn(err)
      if (this.options.stopOnError) {
        console.error(err)
        throw err
      }
      return StageResult.fail(err)
    }

    return StageResult.ok(stageResult)
  }
}
