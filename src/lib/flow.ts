import { IndexedStageResult, FlowResult, Stage } from '../entities'
import { FlowMode } from './flow-mode'
import { FlowOptions } from './flow-options'
import { makeFlow, makeStageRunner } from '../factories'
import { IFlow, IStageRunner } from '../contracts'
import {
  CallbackOk,
  CallbackAllOk,
  CallbackAnyOk,
  CallbackAllFail,
  CallbackAnyFail,
} from './callbacks'

export class Flow<I extends any> {
  private stageExecutor: IStageRunner
  private flow: IFlow
  public result: FlowResult

  constructor(private stages: Array<Stage<I>>, private options?: FlowOptions) {
    const DEFAULT_FLOW_OPTIONS: FlowOptions = {
      isStoppable: false,
      isSafe: true,
      mode: FlowMode.DEFAULT,
    }
    this.options = Object.assign(DEFAULT_FLOW_OPTIONS, options)

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

  /**
   * Calls the callback with the result of the provided stage name or its index.
   */
  async ok(stageId: number | string, callback: CallbackOk): Promise<void> {
    const indexedStageResult: IndexedStageResult | undefined =
      this.result.resultAll.find((result) => {
        return result.id === stageId && !result.isError
      })

    if (!indexedStageResult) {
      await callback(undefined)
    } else {
      await callback(indexedStageResult.getValue())
    }
  }

  /**
   * Calls the callback with the results of stages when any stage runs without error.
   */
  async anyOk(callback: CallbackAnyOk): Promise<void> {
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

  /**
   * Calls the callback with the results of stages when all stages run without errors.
   */
  async allOk(callback: CallbackAllOk): Promise<void> {
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

  /**
   * Calls the callback with the error of the provided stage name or its index.
   */
  async fail(stageId: string | number, callback: Function): Promise<void> {
    const indexedStageResult: IndexedStageResult | undefined =
      this.result.resultAll.find((result) => {
        return result.id === stageId && result.isError
      })
    if (!indexedStageResult) {
      await callback(undefined)
    } else {
      await callback(indexedStageResult.getError())
    }
  }

  /**
   * Calls the callback with the errors of stages when any stage throws an exception.
   */
  async anyFail(callback: CallbackAnyFail): Promise<void> {
    const isFailed = (result: IndexedStageResult) => {
      return result.isError
    }

    const isAnyFailed = this.result.resultAll.some(isFailed)

    if (isAnyFailed) {
      await callback(
        this.result.resultAll
          .filter(isFailed)
          .map((indexedResult) => indexedResult.getError()),
      )
    }
  }

  /**
   * Calls the callback with the errors of stages when all stages throw exceptions.
   */
  async allFail(callback: CallbackAllFail): Promise<void> {
    const isFail = (result: IndexedStageResult) => {
      return result.isError
    }
    const isAllFailed = this.result.resultAll.every(isFail)

    if (isAllFailed) {
      await callback(
        this.result.resultAll.map((indexedResult) => indexedResult.getError()),
      )
    }
  }
}
