import { FlowResult } from './../entities/flow-result'
export interface IFlow {
  execute(param: any): Promise<FlowResult>
}
