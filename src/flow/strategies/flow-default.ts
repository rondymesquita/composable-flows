import { IndexedStageResult } from './../entities/indexed-stage-result'
import { FlowOptions } from './../entities/flow-options'
import { StageParser } from './../parser/stage-parser'
import { StageResult } from '../../stage/entities'
import { Stage } from '../../stage/entities/stage'
import { FlowResult } from '../entities'
import { IStageExecutor } from '../../stage/contracts/istage-executor'
import { IFlow } from '../contracts/iflow'

export class FlowDefault<I> implements IFlow {
  protected stageParser: StageParser<I>

  constructor(
    private readonly options: FlowOptions,
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Stage<I>>,
  ) {
    this.stageParser = new StageParser<I>()
  }
  async execute(param: any): Promise<FlowResult> {
    const isAlways = true
    const shouldSpreadParams = isAlways
    let stageResult: StageResult
    let resultAll: Array<IndexedStageResult> = []

    for (let index = 0; index < this.stages.length; index++) {
      const stage = this.stages[index]

      const { stageFunction, name } = this.stageParser.parse(stage)

      stageResult = await this.stageExecutor.execute(
        stageFunction,
        shouldSpreadParams,
        param,
      )
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
