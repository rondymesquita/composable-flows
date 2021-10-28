import { Stage } from './../stage/entities/stage'
import { FlowResult } from './entities/flow-result'
import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IFlow } from './contracts/iflow'

export class FlowPipeline implements IFlow {
  constructor(
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Stage>,
  ) {}
  async execute(param: any): Promise<FlowResult> {
    let lastStageResult: any = param
    const allResults: Array<any> = []

    for (let index = 0; index < this.stages.length; index++) {
      const stage: Stage = this.stages[index]
      const onlyFirst = index === 0
      const shouldSpreadParams = onlyFirst

      lastStageResult = await this.stageExecutor.execute(
        stage,
        shouldSpreadParams,
        lastStageResult,
      )

      allResults.push(lastStageResult)
    }
    return {
      lastResult: lastStageResult,
      allResults,
    }
  }
}
