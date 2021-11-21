import { Stage } from '../../stage/entities'
import { IStageExecutor } from '../../stage/contracts'
import { IFlow } from '../contracts'
import { FlowMode, FlowOptions } from '../entities'
import { FlowPipeline, FlowDefault } from '../strategies'

export const makeFlow = (
  options: FlowOptions,
  stageExecutor: IStageExecutor,
  stages: Array<Stage>,
): IFlow => {
  if (options.mode === FlowMode.PIPELINE) {
    return new FlowPipeline(options, stageExecutor, stages)
  } else {
    return new FlowDefault(options, stageExecutor, stages)
  }
}
