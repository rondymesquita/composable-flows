import { StageParser } from './parser/stage-parser'
import { Stage } from './entities/stage'
import { IStageExecutor } from './contracts/istage-executor'
export class StageExecutorErrorHandling implements IStageExecutor {
  private stageParser: StageParser
  constructor() {
    this.stageParser = new StageParser()
  }

  async execute(
    stage: Stage,
    shouldSpreadParams: boolean,
    params: any,
  ): Promise<any> {
    let stageResult: any

    const { handler, when } = this.stageParser.parse(stage)
    if (when && !when()) {
      return
    }

    try {
      if (shouldSpreadParams) {
        stageResult = (await handler(...params)) as any
      } else {
        stageResult = (await handler(params)) as any
      }
    } catch (err) {
      console.error(err)
    }
    return stageResult
  }
}
