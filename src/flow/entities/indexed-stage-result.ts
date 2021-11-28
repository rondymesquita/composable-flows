import { StageResult } from '../../stage/entities'
export class IndexedStageResult extends StageResult {
  constructor(public id: string | number, stageResult: StageResult) {
    super(stageResult.isError, stageResult.error, stageResult.value)
  }
}
