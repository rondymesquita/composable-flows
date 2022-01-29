/**
 * @param value  The result of a stage. Contains an error if a stage is not found.
 */
export type CallbackOk = (value: Error | any) => void

/**
 * @param resultValues  List of results of stages with success.
 */
export type CallbackAllOk = (resultValues: Array<any>) => void

/**
 * @param resultValues  List of results of stages with success.
 */
export type CallbackAnyOk = (resultValues: Array<any>) => void
