import { Stage } from '../../stage/entities'
import { IStageExecutor } from '../../stage/contracts'
import { IFlow } from '../contracts'
import { FlowMode, FlowOptions } from '../entities'
// import { FlowPipeline, FlowDefault } from '../strategies'
import { FlowDefault } from '../strategies'

export const makeFlow = <I>(
  options: FlowOptions,
  stageExecutor: IStageExecutor,
  stages: Array<Stage<any>>,
): IFlow => {
  if (options.mode === FlowMode.PIPELINE) {
    // return new FlowPipeline(options, stageExecutor, stages)
    return new FlowDefault<I>(options, stageExecutor, stages)
  } else {
    return new FlowDefault<I>(options, stageExecutor, stages)
  }
}
