import { StageExecutorThrow } from './stage-executor-throw'
import { StageParser } from './parser/stage-parser'
import { Stage } from './entities/stage'
import { IStageExecutor } from './contracts/istage-executor'
export class StageExecutor
  extends StageExecutorThrow
  implements IStageExecutor
{
  async execute(
    stage: Stage,
    shouldSpreadParams: boolean,
    params: any,
  ): Promise<any> {
    let stageResult: any

    try {
      stageResult = await super.execute(stage, shouldSpreadParams, params)
    } catch (err) {
      console.error(err)
    }
    return stageResult
  }
}
