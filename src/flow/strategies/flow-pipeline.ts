import { FlowOptions } from './../entities/flow-options'
import { StageResult } from '../../stage/entities/stage-result'
import { Stage } from '../../stage/entities'
import { FlowResult } from '../entities'
import { IStageExecutor } from '../../stage/contracts/istage-executor'
import { IFlow } from '../contracts/iflow'
import { StageParser } from './../parser/stage-parser'

export class FlowPipeline implements IFlow {
  protected stageParser: StageParser
  constructor(
    private readonly options: FlowOptions,
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Stage>,
  ) {
    this.stageParser = new StageParser()
  }
  async execute(param: any): Promise<FlowResult | any> {
    let stageResult: StageResult = StageResult.ok(param)
    const allResults: Array<any> = []

    let resultAll: Array<any> = []

    for (let index = 0; index < this.stages.length; index++) {
      const stage: Stage = this.stages[index]
      const { stageFunction, name } = this.stageParser.parse(stage)

      const isFirst = index === 0
      const shouldSpreadParams = isFirst

      stageResult = await this.stageExecutor.execute(
        stageFunction,
        shouldSpreadParams,
        stageResult.getValue(),
      )

      resultAll.push({ id: name ? name : index, ...stageResult })

      if (this.options.isStoppable && stageResult.isError) {
        break
      }
    }

    const flowResult: FlowResult = {
      result: stageResult,
      resultAll,
    }

    return flowResult
  }
}
