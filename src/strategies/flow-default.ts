import { IndexedStageResult } from '../entities'
import { FlowOptions } from '../lib'
import { StageParser } from '../parser'
import { StageResult, FlowResult, Stage } from '../entities'
import { IStageRunner, IFlow } from '../contracts'

export class FlowDefault<I> implements IFlow {
  protected stageParser: StageParser<I>

  constructor(
    private readonly options: FlowOptions,
    private readonly stageRunner: IStageRunner,
    private readonly stages: Array<Stage<I>>,
  ) {
    this.stageParser = new StageParser<I>()
  }
  async execute(param: any): Promise<FlowResult> {
    const isAlways = true
    let stageResult: StageResult
    let resultAll: Array<IndexedStageResult> = []

    for (let index = 0; index < this.stages.length; index++) {
      const stage = this.stages[index]

      const { stageFunction, name } = this.stageParser.parse(stage)

      stageResult = await this.stageRunner.execute(stageFunction, param)
      const id = name ? name : index
      resultAll.push(new IndexedStageResult(id, stageResult))

      if (this.options.isStoppable && stageResult.isError) {
        break
      }
    }

    const flowResult: FlowResult = {
      result: stageResult!,
      resultAll,
    }

    return flowResult
  }
}
