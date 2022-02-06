import { StageOptions } from '../entities/stage-options'
import { StageResult } from '../entities/stage-result'
import { IStageRunner } from '../contracts'
export class StageRunner implements IStageRunner {
  constructor(private readonly options: StageOptions) {}

  async execute(stageFunction: Function, params?: any): Promise<StageResult> {
    let stageResult: any

    try {
      if (params) {
        stageResult = (await stageFunction(params)) as any
      } else {
        stageResult = (await stageFunction()) as any
      }
    } catch (err: any) {
      // console.warn('[FLOW WARN]', err)
      if (!this.options.isSafe) {
        // console.error('[FLOW ERROR]', err)
        throw err
      }
      return StageResult.fail(err)
    }

    return StageResult.ok(stageResult)
  }
}
