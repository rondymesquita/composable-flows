export enum Mode {
  STOP_ON_ERROR = 'STOP_ON_ERROR',
  CONTINE_ON_ERROR = 'CONTINE_ON_ERROR',
}

class Options {
  mode: Mode
}

const isOptionsInstance = (value: any) => {
  return 'mode' in value
}
export class Compose {
  private stages: Array<Function> = []
  private options: Options

  constructor(param?: Array<Function> | Options, options?: Options) {
    if (param && param instanceof Array) {
      this.stages = param
    }

    if (param && isOptionsInstance(param)) {
      this.options = param as Options
    }
  }

  push(stage: Function) {
    this.stages.push(stage)
  }

  async execute(param: any) {
    let lastStageResult: any
    for (let i = 0; i < this.stages.length; i++) {
      const stage: Function = this.stages[i]
      lastStageResult = (await stage(param)) as any
    }
    return lastStageResult
  }
}
