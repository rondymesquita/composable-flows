import { IComposeExecutor } from './compose/contracts/icompose-executor'
import { makeStageExecutor } from './stage/stage-executor.factory'
import { makeComposeExecutor } from './compose/compose.factory'
import { IStageExecutor } from './stage/contracts/istage-executor'

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

  push(stage: Function) {
    this.stages.push(stage)
  }

  async execute(...params: any) {
    const result = await this.composeExecutor.execute(params)
    return result
  }
}
