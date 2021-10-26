import { FlowResult } from './entities/flow-result'
import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IFlow } from './contracts/iflow'

export class FlowPipeline implements IFlow {
  constructor(
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Function>,
  ) {}
  async execute(): Promise<FlowResult> {
    let lastStageResult: any
    const allResults: Array<any> = []
    for (let i = 0; i < this.stages.length; i++) {
      const stage: Function = this.stages[i]
      lastStageResult = await this.stageExecutor.execute(stage, lastStageResult)
      allResults.push(lastStageResult)
    }
    return {
      lastResult: lastStageResult,
      allResults,
    }
  }
}
