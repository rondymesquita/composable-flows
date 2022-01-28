import { Stage, StageFunction } from '../entities'

interface StageParserOuput<I> {
  stageFunction: StageFunction<I>
  name?: string
}
export class StageParser<I> {
  parse(stage: Stage<I>): StageParserOuput<I> {
    let stageFunction: StageFunction<I>

    if (typeof stage === 'object') {
      const name = Object.entries(stage)[0][0]
      stageFunction = Object.entries(stage)[0][1]
      return { stageFunction, name }
    } else {
      stageFunction = stage
      return { stageFunction }
    }
  }
}
