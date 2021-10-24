import { ComposableFlow } from './'

describe('ComposableFlow', () => {
  it('should instantiate', async () => {
    expect(() => new ComposableFlow()).not.toThrow()
  })

  it('should execute when passing a single stage', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const param = 'email@email.com'

    const sut = new ComposableFlow([syncStageAlpha.handle])
    const result = await sut.execute(param)
    expect(result).toEqual('alpha-result')
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

    const param = 'email@email.com'

    const sut = new ComposableFlow([
      syncStageAlpha.handle,
      syncStageBeta.handle,
    ])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
    await sut.execute(param)

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith([param])

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith([param])

    expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta'])
  })

  it('should get the result of the last stage', async () => {
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
    const result = await sut.execute(param)
    expect(result).toEqual('beta-result')
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

    const param = 'email@email.com'

    const sut = new ComposableFlow([
      syncStageAlpha.handle,
      syncStageBeta.handle,
    ])

    await expect(sut.execute(param)).rejects.toEqual(new Error('stage error'))

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith([param])

    expect(syncStageBeta.handle).not.toBeCalled()
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

    const paramA = 'first param'
    const paramB = 'first param'
    const result = await sut.execute(paramA, paramB)
    expect(result).toEqual('beta-result')

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith([paramA, paramB])

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith([paramA, paramB])
  })
})
