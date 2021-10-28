import { ComposableFlow } from '../src'

describe('ComposableFlow with default mode', () => {
  it('should instantiate', async () => {
    expect(() => new ComposableFlow()).not.toThrow()
  })

  it('should execute when passing a single stage', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const sut = new ComposableFlow([syncStageAlpha.handle])
    const result = await sut.execute()
    expect(result).toEqual({
      allResults: ['alpha-result'],
      lastResult: 'alpha-result',
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

    const sut = new ComposableFlow([
      syncStageAlpha.handle,
      syncStageBeta.handle,
    ])

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

    const param = 'email@email.com'

    const sut = new ComposableFlow([
      syncStageAlpha.handle,
      syncStageBeta.handle,
    ])
    const result = await sut.execute()
    expect(result).toEqual({
      allResults: ['alpha-result', 'beta-result'],
      lastResult: 'beta-result',
    })
  })

  it('should stop the execution of remaining stages when fails', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw new Error('stage error')
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new ComposableFlow([
      syncStageAlpha.handle,
      syncStageBeta.handle,
    ])

    await expect(sut.execute()).rejects.toEqual(new Error('stage error'))

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).not.toBeCalled()
  })

  it('should continue the pipeline on stage fail when stopOnError is false', async () => {
    const callOrder: Array<string> = []
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        callOrder.push('syncStageAlpha')
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        callOrder.push('syncStageBeta')
        return Promise.resolve('beta-result')
      }),
    }

    const options = {
      stopOnError: false,
    }
    const sut = new ComposableFlow(
      [syncStageAlpha.handle, syncStageBeta.handle],
      options,
    )

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(result).toEqual({
      allResults: [undefined, 'beta-result'],
      lastResult: 'beta-result',
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith()

    expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta'])
  })

  it('should pass multiples parameters for the stage', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new ComposableFlow([
      syncStageAlpha.handle,
      syncStageBeta.handle,
    ])

    const result = await sut.execute('email@email.com', 'admin')
    expect(result).toEqual({
      allResults: ['alpha-result', 'beta-result'],
      lastResult: 'beta-result',
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith('email@email.com', 'admin')

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith('email@email.com', 'admin')
  })

  it('should not execute a stage if "when" returns false ', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new ComposableFlow([
      {
        when: () => false,
        handler: syncStageAlpha.handle,
      },
      syncStageBeta.handle,
    ])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(result).toEqual({
      allResults: [undefined, 'beta-result'],
      lastResult: 'beta-result',
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(0)

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith()
  })

  it('should execute a stage if "when" returns true ', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new ComposableFlow([
      {
        when: () => true,
        handler: syncStageAlpha.handle,
      },
      syncStageBeta.handle,
    ])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(result).toEqual({
      allResults: ['alpha-result', 'beta-result'],
      lastResult: 'beta-result',
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith()
  })

  it('should allow "handle" to be a function with parameters', async () => {
    const syncStageAlpha = {
      handle: jest.fn((param) => 'fake').mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn((param) => 'fake').mockReturnValue('beta-result'),
    }

    const sut = new ComposableFlow([
      {
        handler: syncStageAlpha.handle,
        when: () => true,
      },
      syncStageBeta.handle,
    ])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    const result = await sut.execute()
    expect(result).toEqual({
      allResults: ['alpha-result', 'beta-result'],
      lastResult: 'beta-result',
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith()
  })
})
