import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IFlow } from './contracts/iflow'

export class FlowDefault implements IFlow {
  constructor(
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Function>,
  ) {}
  async execute(): Promise<any> {
    let lastStageResult: any
    for (let i = 0; i < this.stages.length; i++) {
      const stage: Function = this.stages[i]
      lastStageResult = await this.stageExecutor.execute(stage)
    }
    return lastStageResult
  }
}
