import { Stage } from '../entities'
import { IStageRunner, IFlow } from '../contracts'
import { FlowMode, FlowOptions } from '../lib'
import { FlowDefault, FlowPipeline } from '../strategies'
export const makeFlow = <I>(
  options: FlowOptions,
  stageExecutor: IStageRunner,
  stages: Array<Stage<any>>,
): IFlow => {
  if (options.mode === FlowMode.PIPELINE) {
    return new FlowPipeline<I>(options, stageExecutor, stages)
  } else {
    return new FlowDefault<I>(options, stageExecutor, stages)
  }
}
