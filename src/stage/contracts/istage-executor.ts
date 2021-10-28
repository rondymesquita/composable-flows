import { Stage } from './../entities/stage'
export interface IStageExecutor {
  execute(stage: Stage, shouldSpreadParams: boolean, params?: any): Promise<any>
}
