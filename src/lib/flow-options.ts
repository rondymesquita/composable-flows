import { FlowMode } from './flow-mode'

// export interface FlowOptions {
//   /** Set flow the flow mode */
//   mode?: FlowMode

//   /** if it should interrupt the flow and all subsequent stages if an exception occurs.*/
//   isStoppable?: boolean

//   /** If it should throw an exception if an error occurs. */
//   isSafe?: boolean
// }

export class FlowOptions {
  private constructor() {}
  /** Set flow the flow mode */
  mode?: FlowMode = FlowMode.DEFAULT

  /** if it should interrupt the flow and all subsequent stages if an exception occurs.*/
  isStoppable?: boolean

  /** If it should throw an exception if an error occurs. */
  isSafe?: boolean
}
