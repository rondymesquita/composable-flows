import { Stage } from '../../stage/entities/stage'
export class StageParser {
  parse(stage: Stage): any {
    let stageFunction: Function

    if (typeof stage === 'object') {
      const name = Object.entries(stage)[0][0]
      stageFunction = Object.entries(stage)[0][1]
      return { stageFunction, name }
    } else {
      stageFunction = stage as Function
      return { stageFunction }
    }
  }
}