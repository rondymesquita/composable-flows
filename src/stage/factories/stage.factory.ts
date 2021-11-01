import { FlowOptions } from './../../flow/entities/flow-options'
import { StageExecutor } from '../stage-executor'
import { StageExecutorThrow } from '../stage-executor-throw'
export const makeStageExecutor = (options: FlowOptions) => {
  if (options.stopOnError) {
    return new StageExecutorThrow()
  } else {
    return new StageExecutor()
  }
}
