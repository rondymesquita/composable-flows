import { FlowOptions, Flow } from '../src'
describe('Flow with default mode', () => {
  it('should execute when passing a single stage', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const sut = new Flow([syncStageAlpha.handle])
    const result = await sut.execute()
    expect(result).toEqual({
      resultAll: [
        {
          id: 0,
          error: undefined,
          isError: false,
          value: 'alpha-result',
        },
      ],
      result: {
        error: undefined,
        isError: false,
        value: 'alpha-result',
      },
    })
  })

  it('should call the stages in sequence when passing by constructor', async () => {
    const callOrder: Array<string> = []
    const syncStageAlpha = {
      handle: jest
        .fn()
        .mockImplementation(() => callOrder.push('syncStageAlpha')),
    }

    const syncStageBeta = {
      handle: jest
        .fn()
        .mockImplementation(() => callOrder.push('syncStageBeta')),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
    await sut.execute()

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith()

    expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta'])
  })

  it('should get the results of flow', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    const result = await sut.execute()
    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'beta-result',
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
      ],
    })
  })

  it('should use same initial parameter for all stages', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const param = 'email@email.com'

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute(param)

    expect(syncStageAlpha.handle).toBeCalledWith('email@email.com')
    expect(syncStageBeta.handle).toBeCalledWith('email@email.com')
  })

  it('should continue the flow when a stage fails if isSafe = true and isStoppable = false', async () => {
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
      isStoppable: false,
      isSafe: true,
    })

    const result = await sut.execute()
    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'beta-result',
      },
      resultAll: [
        {
          id: 0,
          error: fakeError,
          isError: true,
          value: undefined,
        },
        {
          id: 1,
          error: undefined,
          isError: false,
          value: 'beta-result',
        },
      ],
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith()
  })

  it('should continue the flow on stage fail when isStoppable is false (by param)', async () => {
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
      isStoppable: false,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'beta-result',
      },
      resultAll: [
        {
          error: new Error('alpha stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
        {
          error: undefined,
          id: 1,
          isError: false,
          value: 'beta-result',
        },
      ],
    })
  })

  it('should continue the flow on stage fail when isStoppable is false (by default)', async () => {
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

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'beta-result',
      },
      resultAll: [
        {
          error: new Error('alpha stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
        {
          error: undefined,
          id: 1,
          isError: false,
          value: 'beta-result',
        },
      ],
    })
  })

  it('should not continue the flow on stage fail when isStoppable is true (by param)', async () => {
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
      isStoppable: true,
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

  it('should throw exception on execute when isSafe is false (by param)', async () => {
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
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(1)

    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'beta-result',
      },
      resultAll: [
        {
          error: new Error('alpha stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
        {
          error: undefined,
          id: 1,
          isError: false,
          value: 'beta-result',
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
      isSafe: true,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(1)

    expect(result).toEqual({
      result: {
        error: undefined,
        isError: false,
        value: 'beta-result',
      },
      resultAll: [
        {
          error: new Error('alpha stage error'),
          id: 0,
          isError: true,
          value: undefined,
        },
        {
          error: undefined,
          id: 1,
          isError: false,
          value: 'beta-result',
        },
      ],
    })
  })

  it('should call success handler to get stage result by index', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockResolvedValue({ value: 'alpha-result' }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockResolvedValue({ value: 'beta-result' }),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    await sut.ok(0, (data: any) => {
      expect(data).toEqual({ value: 'alpha-result' })
    })
  })

  it('should call success handler to get stage result by name', async () => {
    const syncStageAlpha = {
      handle: {
        'alpha stage name': jest
          .fn()
          .mockResolvedValue({ value: 'alpha-result' }),
      },
    }

    const syncStageBeta = {
      handle: jest.fn().mockResolvedValue({ value: 'beta-result' }),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    await sut.ok('alpha stage name', (data: any) => {
      expect(data).toEqual({ value: 'alpha-result' })
    })
  })
})
