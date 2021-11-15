import { FlowMode, FlowOptions } from './entities'
import { makeFlow } from './factories'
import { FlowResult } from './entities'
import { Stage } from '../stage/entities'
import { IFlow } from './contracts'
import { makeStageExecutor, IStageExecutor } from '../stage'

const DEFAULT_OPTIONS: FlowOptions = {
  stopOnError: false,
  mode: FlowMode.DEFAULT,
}

const isOptionsInstance = (value: any) => {
  return 'stopOnError' in value
}

export class Flow {
  private stages: Array<Stage> = []
  private options: FlowOptions
  private stageExecutor: IStageExecutor
  private flow: IFlow
  public result: FlowResult

  constructor(param?: Array<Stage> | FlowOptions, options?: FlowOptions) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as FlowOptions
    }

    this.options = Object.assign(DEFAULT_OPTIONS, options)

    if (
      this.options.stopOnError === false &&
      this.options.mode === FlowMode.PIPELINE
    ) {
      console.warn(
        'Some options are incompatible\n',
        'stopOnError = "false" is incompatible with mode = "PIPELINE". Setting stopOnError to "true"',
      )
      this.options.stopOnError = true
    }

    this.stageExecutor = makeStageExecutor(this.options)

    this.flow = makeFlow(this.options, this.stageExecutor, this.stages)
  }

  async execute(...params: any[]): Promise<FlowResult> {
    this.result = await this.flow.execute(params)
    return this.result
  }

  async success(stageId: string, callback: Function): Promise<void> {
    const stageResult = this.result.resultAll.find((result) => {
      return result.id === stageId && result.state == 'success'
    })
    if (!stageResult) {
      throw new Error('here')
    }
    await callback(stageResult.data)
  }

  async fail(stageId: string, callback: Function): Promise<void> {
    const stageResult = this.result.resultAll.find((result) => {
      return result.id === stageId && result.state == 'fail'
    })
    if (!stageResult) {
      throw new Error('here')
    }
    await callback(stageResult.data)
  }
}
