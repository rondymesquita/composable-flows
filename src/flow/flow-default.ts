import { Stage } from './../stage/entities/stage'
import { FlowResult } from './entities/flow-result'
import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IFlow } from './contracts/iflow'

export class FlowDefault implements IFlow {
  constructor(
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Stage>,
  ) {}
  async execute(param: any): Promise<FlowResult> {
    let lastStageResult: any
    const allResults: Array<any> = []
    const always = true
    const shouldSpreadParams = always

    for (let index = 0; index < this.stages.length; index++) {
      const stage: Stage = this.stages[index]
      lastStageResult = await this.stageExecutor.execute(
        stage,
        shouldSpreadParams,
        param,
      )
      allResults.push(lastStageResult)
    }
    return {
      lastResult: lastStageResult,
      allResults,
    }
  }
}
