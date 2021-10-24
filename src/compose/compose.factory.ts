import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IComposeExecutor } from './contracts/icompose-executor'
import { Mode } from '../index'
import { ComposeExecutorPipeline } from './compose-executor-pipeline'

import { Options } from '..'
export const makeComposeExecutor = (
  options: Options,
  stageExecutor: IStageExecutor,
): IComposeExecutor => {
  return new ComposeExecutorPipeline(stageExecutor)
}
