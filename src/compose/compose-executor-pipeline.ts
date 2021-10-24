import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IComposeExecutor } from './contracts/icompose-executor'

export class ComposeExecutorPipeline implements IComposeExecutor {
  constructor(
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Function>,
  ) {}
  async execute(params: any): Promise<any> {
    let lastStageResult: any
    for (let i = 0; i < this.stages.length; i++) {
      const stage: Function = this.stages[i]
      lastStageResult = await this.stageExecutor.execute(stage, params)
    }
    return lastStageResult
  }
}
