import { FlowOptions } from './../../flow/entities/flow-options'
import { StageExecutor } from '../stage-executor'
export const makeStageExecutor = (options: FlowOptions) => {
  return new StageExecutor({
    isStoppable: options.isStoppable,
    isSafe: options.isSafe,
  })
}
