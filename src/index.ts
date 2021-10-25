import { IComposeExecutor, makeComposeExecutor } from './compose'
import { makeStageExecutor, IStageExecutor } from './stage'

export enum Mode {
  PIPELINE = 'PIPELINE',
  DEFAULT = 'DEFAULT',
}

export class Options {
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
  private stages: Array<Function> = []
  private options: Options
  private stageExecutor: IStageExecutor
  private composeExecutor: IComposeExecutor

  constructor(param?: Array<Function> | Options, options?: Options) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as Options
    }

    this.options = Object.assign(DEFAULT_OPTIONS, options)

    this.stageExecutor = makeStageExecutor(this.options)
    this.composeExecutor = makeComposeExecutor(
      this.options,
      this.stageExecutor,
      this.stages,
    )
  }

  async execute() {
    const result = await this.composeExecutor.execute()
    return result
  }
}
