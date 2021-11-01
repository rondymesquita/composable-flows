import { Stage } from '../../stage/entities'
import { IStageExecutor } from '../../stage/contracts'
import { IFlow } from '../contracts'
import { FlowMode, FlowOptions } from '../entities'
import { FlowPipeline } from '../flow-pipeline'
import { FlowDefault } from '../flow-default'

export const makeFlow = (
  options: FlowOptions,
  stageExecutor: IStageExecutor,
  stages: Array<Stage>,
): IFlow => {
  if (options.mode === FlowMode.PIPELINE) {
    return new FlowPipeline(stageExecutor, stages)
  } else {
    return new FlowDefault(stageExecutor, stages)
  }
}
