import { StageParser } from './../parser/stage-parser'
import { StageResult } from '../../stage/entities'
import { Stage } from '../../stage/entities/stage'
import { FlowResult } from '../entities'
import { IStageExecutor } from '../../stage/contracts/istage-executor'
import { IFlow } from '../contracts/iflow'

export class FlowDefault implements IFlow {
  protected stageParser: StageParser

  constructor(
    private readonly stageExecutor: IStageExecutor,
    private readonly stages: Array<Stage>,
  ) {
    this.stageParser = new StageParser()
  }
  async execute(param: any): Promise<FlowResult> {
    const isAlways = true
    const shouldSpreadParams = isAlways
    let stageResult: StageResult | undefined = undefined
    let resultAll: Array<any> = []

    for (let index = 0; index < this.stages.length; index++) {
      const stage = this.stages[index]

      const { stageFunction, name } = this.stageParser.parse(stage)

      stageResult = await this.stageExecutor.execute(
        stageFunction,
        shouldSpreadParams,
        param,
      )

      resultAll.push({ id: name ? name : index, ...stageResult })
    }

    const flowResult: FlowResult = {
      result: stageResult,
      resultAll,
    }

    return flowResult
  }
}
