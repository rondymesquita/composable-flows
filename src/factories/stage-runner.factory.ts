import { FlowOptions } from '../lib'
import { StageRunner } from '../runner'
export const makeStageRunner = (options: FlowOptions) => {
  return new StageRunner({
    isStoppable: options.isStoppable,
    isSafe: options.isSafe,
  })
}
