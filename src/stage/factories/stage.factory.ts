import { FlowOptions } from './../../flow/entities/flow-options'
import { StageExecutor } from '../stage-executor'
export const makeStageExecutor = (options: FlowOptions) => {
  return new StageExecutor({ stopOnError: options.stopOnError })
}
