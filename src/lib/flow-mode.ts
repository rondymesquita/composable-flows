export enum FlowMode {
  /** Set flow to run in pipeline mode. Result of a stage is the parameter of next stage. */
  PIPELINE = 'PIPELINE',

  /** Set flow to run in default mode. All stages receives the same parameter of `execute` method. */
  DEFAULT = 'DEFAULT',
}
