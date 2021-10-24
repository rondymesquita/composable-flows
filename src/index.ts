import { makeExecutor } from './executor/executor.factory'
import { IStageExecutor } from './executor/istage-executor'
export enum Mode {
  STOP_ON_ERROR = 'STOP_ON_ERROR',
  CONTINE_ON_ERROR = 'CONTINE_ON_ERROR',
}

export class Options {
  stopOnError: boolean
}

const DEFAULT_OPTIONS: Options = {
  stopOnError: true,
}

const isOptionsInstance = (value: any) => {
  return 'stopOnError' in value
}
export class Compose {
  private stages: Array<Function> = []
  private options: Options
  private stageExecutor: IStageExecutor

  constructor(param?: Array<Function> | Options, options?: Options) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as Options
    }

    this.options = options ? options : DEFAULT_OPTIONS

    this.stageExecutor = makeExecutor(this.options)
  }

  push(stage: Function) {
    this.stages.push(stage)
  }

  async execute(...params: any) {
    let lastStageResult: any
    for (let i = 0; i < this.stages.length; i++) {
      const stage: Function = this.stages[i]
      lastStageResult = await this.stageExecutor.execute(stage, params)
    }
    return lastStageResult
  }
}
