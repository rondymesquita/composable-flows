import { FlowMode, FlowOptions } from './entities'
import { makeFlow } from './factories'
import { FlowResult } from './entities'
import { Stage } from '../stage/entities'
import { IFlow } from './contracts'
import { makeStageExecutor, IStageExecutor } from '../stage'

const DEFAULT_OPTIONS: FlowOptions = {
  stopOnError: true,
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

  constructor(param?: Array<Stage> | FlowOptions, options?: FlowOptions) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as FlowOptions
    }

    this.options = Object.assign(DEFAULT_OPTIONS, options)

    this.stageExecutor = makeStageExecutor(this.options)
    this.flow = makeFlow(this.options, this.stageExecutor, this.stages)
  }

  async execute(...params: any[]): Promise<FlowResult> {
    const result = await this.flow.execute(params)
    return result
  }
}
