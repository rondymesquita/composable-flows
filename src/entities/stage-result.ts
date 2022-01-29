export class StageResult {
  public readonly isError: boolean
  public readonly error: Error | undefined
  public readonly value: any

  protected constructor(isError: boolean, error?: Error, value?: any) {
    if (isError && value) {
      throw new Error(
        'Error and value are mutually exclusive. Inform only one of them.',
      )
    }

    this.isError = isError
    this.error = error
    this.value = value
  }

  public static ok<T>(value?: T): StageResult {
    return new StageResult(false, undefined, value)
  }

  public static fail<E extends Error>(error: E): StageResult {
    return new StageResult(true, error)
  }

  public getValue(): any {
    if (this.isError) {
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue'",
      )
    }

    return this.value
  }

  public getError(): Error {
    if (!this.isError) {
      throw new Error(
        "Can't get the error of an success result. Use 'getValue'",
      )
    }

    return this.error as Error
  }
}
