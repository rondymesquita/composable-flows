/**
 * @param value  The result of a stage. Contains an undefined if a stage is not found.
 */
export type CallbackOk = (value: Error | any) => void

/**
 * @param resultValues  List of results of stages that run with success.
 */
export type CallbackAllOk = (resultValues: Array<any>) => void

/**
 * @param resultValues  List of results of stages that run with success.
 */
export type CallbackAnyOk = (resultValues: Array<any>) => void

/**
 * @param value  The error of a stage. Contains an undefined if a stage is not found.
 */
export type CallbackFail = (value: Error | any) => void

/**
 * @param resultValues  List of errors of stages that thow exception.
 */
export type CallbackAllFail = (errors: Array<Error>) => void

/**
 * @param resultValues  List of errors of stages that thow exception.
 */
export type CallbackAnyFail = (errors: Array<Error>) => void
