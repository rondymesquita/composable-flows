import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IComposeExecutor } from './contracts/icompose-executor'
import { Mode } from '../index'
import { ComposeExecutorPipeline } from './compose-executor-pipeline'
import { ComposeExecutorDefault } from './compose-executor-default'

import { Options } from '..'
export const makeComposeExecutor = (
  options: Options,
  stageExecutor: IStageExecutor,
  stages: Array<Function>,
): IComposeExecutor => {
  if (options.mode === Mode.PIPELINE) {
    return new ComposeExecutorPipeline(stageExecutor, stages)
  } else {
    return new ComposeExecutorDefault(stageExecutor, stages)
  }
}
