import { FlowOptions } from './../../flow/entities/flow-options'
import { StageExecutorErrorHandling } from '../stage-executor-error-handling'
import { StageExecutor } from '../stage-executor'
export const makeStageExecutor = (options: FlowOptions) => {
  if (options.stopOnError) {
    return new StageExecutor()
  } else {
    return new StageExecutorErrorHandling()
  }
}
