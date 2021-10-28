import { Stage } from './../entities/stage'
export class StageParser {
  parse(stage: Stage): any {
    let handler: Function
    let when: Function
    if ('when' in stage && stage.when) {
      handler = stage.handler
      when = stage.when

      return {
        handler,
        when,
      }
    } else {
      handler = stage as Function
      return { handler }
    }
  }
}
