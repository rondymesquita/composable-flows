import { IndexedStageResult, FlowResult, Stage } from '../entities'
import { FlowMode } from './flow-mode'
import { FlowOptions } from './flow-options'
import { makeFlow, makeStageRunner } from '../factories'
import { IFlow, IStageRunner } from '../contracts'

export class Flow<I extends any, O = any[]> {
  private stageExecutor: IStageRunner
  private flow: IFlow
  public result: FlowResult

  constructor(private stages: Array<Stage<I>>, private options?: FlowOptions) {
    const DEFAULT_OPTIONS: FlowOptions = {
      isStoppable: true,
      isSafe: true,
      mode: FlowMode.DEFAULT,
    }

    this.options = Object.assign(DEFAULT_OPTIONS, options)

    if (
      this.options.isStoppable === false &&
      this.options.mode === FlowMode.PIPELINE
    ) {
      console.warn(
        'Some options are incompatible\n',
        'isStoppable = "false" is incompatible with mode = "PIPELINE". Setting isStoppable to "true"',
      )
      this.options.isStoppable = true
    }

    this.stageExecutor = makeStageRunner(this.options)

    this.flow = makeFlow<I>(this.options, this.stageExecutor, this.stages)
  }

  async execute(params?: I): Promise<FlowResult> {
    this.result = await this.flow.execute(params)
    return this.result
  }

  async ok(stageId: number | string, callback: Function): Promise<void> {
    const indexedStageResult: IndexedStageResult | undefined =
      this.result.resultAll.find((result) => {
        return result.id === stageId && !result.isError
      })

    if (!indexedStageResult) {
      const error = new Error(`No stage found for stageId ${stageId}`)
      await callback(error)
    } else {
      await callback(indexedStageResult.getValue())
    }
  }

  async anyOk(callback: Function): Promise<void> {
    const isSuccess = (result: IndexedStageResult) => {
      return !result.isError
    }

    const isAnyOk = this.result.resultAll.some(isSuccess)

    if (isAnyOk) {
      await callback(
        this.result.resultAll
          .filter(isSuccess)
          .map((indexedResult) => indexedResult.getValue()),
      )
    }
  }

  async allOk(callback: Function): Promise<void> {
    const isSuccess = (result: IndexedStageResult) => {
      return !result.isError
    }
    const isAllOk = this.result.resultAll.every(isSuccess)

    if (isAllOk) {
      await callback(
        this.result.resultAll.map((indexedResult) => indexedResult.getValue()),
      )
    }
  }

  // async fail(stageId: string, callback: Function): Promise<void> {
  //   const stageResult = this.result.resultAll.find((result) => {
  //     return result.id === stageId && result.state == 'fail'
  //   })
  //   if (!stageResult) {
  //     throw new Error('here')
  //   }
  //   await callback(stageResult.data)
  // }
}
