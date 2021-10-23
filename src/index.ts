export enum Mode {
  STOP_ON_ERROR = 'STOP_ON_ERROR',
  CONTINE_ON_ERROR = 'CONTINE_ON_ERROR',
}

class Options {
  stopOnError: boolean
}

const DEFAULT_OPTIONS: Options = {
  stopOnError: true,
}

const isOptionsInstance = (value: any) => {
  return 'mode' in value
}

class StageExecutor {
  constructor(private readonly options: Options) {}
  async execute(stage: Function, param: any): Promise<any> {
    let stageResult: any
    if (this.options.stopOnError) {
      stageResult = (await stage(param)) as any
    } else {
      try {
        stageResult = (await stage(param)) as any
      } catch (err) {
        console.error(err)
      }
    }
    return stageResult
  }
}
export class Compose {
  private stages: Array<Function> = []
  private options: Options
  private stageExecutor: StageExecutor

  constructor(
    param?: Array<Function> | Options,
    options: Options = DEFAULT_OPTIONS,
  ) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as Options
    } else {
      this.options = options
    }

    this.stageExecutor = new StageExecutor(this.options)
  }

  push(stage: Function) {
    this.stages.push(stage)
  }

  async execute(param: any) {
    let lastStageResult: any
    for (let i = 0; i < this.stages.length; i++) {
      const stage: Function = this.stages[i]
      lastStageResult = await this.stageExecutor.execute(stage, param)
    }
    return lastStageResult
  }
}
