import { IStageExecutor } from '../stage/contracts/istage-executor'
import { IFlow } from './contracts/iflow'
import { Mode } from '../index'
import { FlowPipeline } from './flow-pipeline'
import { FlowDefault } from './flow-default'

import { Options } from '..'
export const makeFlow = (
  options: Options,
  stageExecutor: IStageExecutor,
  stages: Array<Function>,
): IFlow => {
  if (options.mode === Mode.PIPELINE) {
    return new FlowPipeline(stageExecutor, stages)
  } else {
    return new FlowDefault(stageExecutor, stages)
  }
}
