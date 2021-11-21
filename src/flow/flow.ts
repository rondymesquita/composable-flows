import { IndexedStageResult } from './entities/indexed-stage-result'
import { FlowMode, FlowOptions } from './entities'
import { makeFlow } from './factories'
import { FlowResult } from './entities'
import { Stage } from '../stage/entities'
import { IFlow } from './contracts'
import { makeStageExecutor, IStageExecutor } from '../stage'

const isOptionsInstance = (value: any) => {
  return 'isSafe' in value && 'isStoppable' in value
}

export class Flow {
  private stages: Array<Stage> = []
  private options: FlowOptions
  private stageExecutor: IStageExecutor
  private flow: IFlow
  public result: FlowResult

  constructor(param: Array<Stage> | FlowOptions, options?: FlowOptions) {
    const DEFAULT_OPTIONS: FlowOptions = {
      isStoppable: true,
      isSafe: true,
      mode: FlowMode.DEFAULT,
    }

    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as FlowOptions
    }

    // this.stages = stages
    this.options = Object.assign(DEFAULT_OPTIONS, options)

    if (
      this.options.isStoppable === false &&
      this.options.mode === FlowMode.PIPELINE
    ) {
      console.warn(
        'Some options are incompatible\n',
        'isStoppable = "false" is incompatible with mode = "PIPELINE". Setting isStoppable to "true"',
      )
      this.options.isStoppable = true
    }

    this.stageExecutor = makeStageExecutor(this.options)

    this.flow = makeFlow(this.options, this.stageExecutor, this.stages)
  }

  async execute(...params: any[]): Promise<FlowResult> {
    this.result = await this.flow.execute(params)
    return this.result
  }

  async ok(stageId: number | string, callback: Function): Promise<void> {
    const indexedStageResult: IndexedStageResult | undefined =
      this.result.resultAll.find((result) => {
        return result.id === stageId && !result.isError
      })
    console.log(this.result)

    if (!indexedStageResult) {
      const error = new Error(`No stage found for stageId ${stageId}`)
      await callback(error)
    } else {
      await callback(indexedStageResult.getValue())
    }
  }

  // async fail(stageId: string, callback: Function): Promise<void> {
  //   const stageResult = this.result.resultAll.find((result) => {
  //     return result.id === stageId && result.state == 'fail'
  //   })
  //   if (!stageResult) {
  //     throw new Error('here')
  //   }
  //   await callback(stageResult.data)
  // }
}
