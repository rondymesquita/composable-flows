import { FlowResult } from './../entities/flow-result'
export interface IFlow {
  execute(): Promise<FlowResult>
}
