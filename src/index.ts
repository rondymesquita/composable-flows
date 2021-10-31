import { Stage } from './stage/entities'
import { IFlow, makeFlow } from './flow'
import { makeStageExecutor, IStageExecutor } from './stage'

export enum Mode {
  PIPELINE = 'PIPELINE',
  DEFAULT = 'DEFAULT',
}

export interface Options {
  stopOnError?: boolean
  mode?: Mode
}

const DEFAULT_OPTIONS: Options = {
  stopOnError: true,
  mode: Mode.DEFAULT,
}

const isOptionsInstance = (value: any) => {
  return 'stopOnError' in value
}

export class ComposableFlow {
  private stages: Array<Stage> = []
  private options: Options
  private stageExecutor: IStageExecutor
  private flow: IFlow

  constructor(param?: Array<Stage> | Options, options?: Options) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as Options
    }

    this.options = Object.assign(DEFAULT_OPTIONS, options)

    this.stageExecutor = makeStageExecutor(this.options)
    this.flow = makeFlow(this.options, this.stageExecutor, this.stages)
  }

  async execute(...params: any[]) {
    const result = await this.flow.execute(params)
    return result
  }
}
