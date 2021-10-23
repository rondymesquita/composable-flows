export class Compose {
  private stages: Array<Function> = []

  constructor(stages?: Array<Function>) {
    if (stages) {
      this.stages = stages
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
