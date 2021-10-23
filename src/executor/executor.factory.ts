import { StageExecutorErrorHandling } from './stage-executor-error-handling'
import { StageExecutor } from './stage-executor'
import { Options } from '../'
export const makeExecutor = (options: Options) => {
  if (options.stopOnError) {
    return new StageExecutor()
  } else {
    return new StageExecutorErrorHandling()
  }
}
