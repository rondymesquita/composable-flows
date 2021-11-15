import { Flow, FlowMode } from '../src'

describe('When FlowMode is PIPELINE', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should pass result of stage as param to the next when mode is pipeline', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('alpha-result')
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('beta-result')
      }),
    }

    const syncStageGamma = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('gamma-result')
      }),
    }

    const options = {
      mode: FlowMode.PIPELINE,
    }
    const sut = new Flow(
      [syncStageAlpha.handle, syncStageBeta.handle, syncStageGamma.handle],
      options,
    )

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
    expect(syncStageGamma.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'gamma-result',
      },
      resultAll: [
        {
          error: undefined,
          id: 0,
          isError: false,
          value: 'alpha-result',
        },
        {
          error: undefined,
          id: 1,
          isError: false,
          value: 'beta-result',
        },
        {
          error: undefined,
          id: 2,
          isError: false,
          value: 'gamma-result',
        },
      ],
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith('alpha-result')

    expect(syncStageGamma.handle).toBeCalledTimes(1)
    expect(syncStageGamma.handle).toBeCalledWith('beta-result')
  })

  it('should pass multiples initial parameters for the stage on execute method', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('alpha-result')
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('beta-result')
      }),
    }

    const syncStageGamma = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('gamma-result')
      }),
    }

    const options = {
      mode: FlowMode.PIPELINE,
    }
    const sut = new Flow(
      [syncStageAlpha.handle, syncStageBeta.handle, syncStageGamma.handle],
      options,
    )

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
    expect(syncStageGamma.handle).toBeCalledTimes(0)

    const result = await sut.execute('alpha-param-1', 'alpha-param-2')
    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'gamma-result',
      },
      resultAll: [
        {
          error: undefined,
          id: 0,
          isError: false,
          value: 'alpha-result',
        },
        {
          error: undefined,
          id: 1,
          isError: false,
          value: 'beta-result',
        },
        {
          error: undefined,
          id: 2,
          isError: false,
          value: 'gamma-result',
        },
      ],
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith(
      'alpha-param-1',
      'alpha-param-2',
    )

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith('alpha-result')

    expect(syncStageGamma.handle).toBeCalledTimes(1)
    expect(syncStageGamma.handle).toBeCalledWith('beta-result')
  })

  it('should stop the flow stages when fails  stopOnError is false (by default)', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw new Error('stage error')
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const options = {
      mode: FlowMode.PIPELINE,
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    await expect(sut.execute()).rejects.toEqual(new Error('stage error'))

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).not.toBeCalled()
  })

  it('should stop the flow stages when fails when stopOnError is true', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw new Error('stage error')
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const options = {
      mode: FlowMode.PIPELINE,
      stopOnError: true,
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    await expect(sut.execute()).rejects.toEqual(new Error('stage error'))

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).not.toBeCalled()
  })
})
