import { StageResult } from '../entities/stage-result'
import { Stage } from '../entities/stage'
export interface IStageRunner {
  execute(
    stageFunction: Function,
    shouldSpreadParams: boolean,
    params?: any,
  ): Promise<StageResult>
}
