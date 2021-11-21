import { FlowOptions } from './../src/flow/entities/flow-options'
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

  it('should not continue the flow when a stage fails since isStoppable=false is incompatible with Pipeline mode', async () => {
    const fakeError = new Error('stage error')
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw fakeError
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], {
      mode: FlowMode.PIPELINE,
      isStoppable: false,
    })

    const result = await sut.execute()
    expect(result).toEqual({
      result: {
        error: new Error('stage error'),
        isError: true,
        value: undefined,
      },
      resultAll: [
        {
          error: new Error('stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
      ],
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(0)
  })

  it('should not continue the flow when a stage fails since isStoppable=true (by default)', async () => {
    const fakeError = new Error('stage error')
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw fakeError
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], {
      mode: FlowMode.PIPELINE,
    })

    const result = await sut.execute()
    expect(result).toEqual({
      result: {
        error: new Error('stage error'),
        isError: true,
        value: undefined,
      },
      resultAll: [
        {
          error: new Error('stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
      ],
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(0)
  })

  it('should not continue the flow when a stage fails since isStoppable=true (by param)', async () => {
    const fakeError = new Error('stage error')
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw fakeError
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], {
      mode: FlowMode.PIPELINE,
      isStoppable: true,
    })

    const result = await sut.execute()
    expect(result).toEqual({
      result: {
        error: new Error('stage error'),
        isError: true,
        value: undefined,
      },
      resultAll: [
        {
          error: new Error('stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
      ],
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(0)
  })

  it('should throw exception on execute when isSafe is false', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('beta-result')
      }),
    }

    const options: FlowOptions = {
      mode: FlowMode.PIPELINE,
      isSafe: false,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    await expect(sut.execute()).rejects.toEqual(new Error('alpha stage error'))
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
  })

  it('should not throw an exception on execute when isSafe is true (by default)', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('beta-result')
      }),
    }
    const options: FlowOptions = {
      mode: FlowMode.PIPELINE,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    expect(result).toEqual({
      result: {
        error: new Error('alpha stage error'),
        isError: true,
        value: undefined,
      },
      resultAll: [
        {
          error: new Error('alpha stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
      ],
    })
  })

  it('should not throw an exception on execute when isSafe is true (by param)', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.resolve('beta-result')
      }),
    }
    const options: FlowOptions = {
      mode: FlowMode.PIPELINE,
      isSafe: true,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    expect(result).toEqual({
      result: {
        error: new Error('alpha stage error'),
        isError: true,
        value: undefined,
      },
      resultAll: [
        {
          error: new Error('alpha stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
      ],
    })
  })
})
