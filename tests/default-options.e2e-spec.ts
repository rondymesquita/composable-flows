import { ComposableFlow } from '../src'

describe('ComposableFlow with default options', () => {
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
    expect(syncStageAlpha.handle).toBeCalledWith(undefined)

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith(undefined)

    expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta'])
  })

  it('should get the result of flow', async () => {
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
    expect(syncStageAlpha.handle).toBeCalledWith(undefined)

    expect(syncStageBeta.handle).not.toBeCalled()
  })

  // it('should pass multiples parameters for the stage', async () => {
  //   const syncStageAlpha = {
  //     handle: jest.fn().mockReturnValue('alpha-result'),
  //   }

  //   const syncStageBeta = {
  //     handle: jest.fn().mockReturnValue('beta-result'),
  //   }

  //   const sut = new ComposableFlow([
  //     syncStageAlpha.handle,
  //     syncStageBeta.handle,
  //   ])

  //   const result = await sut.execute()
  //   expect(result).toEqual('beta-result')

  //   expect(syncStageAlpha.handle).toBeCalledTimes(1)
  //   expect(syncStageAlpha.handle).toBeCalledWith(undefined)

  //   expect(syncStageBeta.handle).toBeCalledTimes(1)
  //   expect(syncStageBeta.handle).toBeCalledWith(undefined)
  // })
})
