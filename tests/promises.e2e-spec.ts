import { ComposableFlow } from '../src'

describe('ComposableFlow with promises as stages', () => {
  it('should call stages when stages are promises', async () => {
    const callOrder: Array<string> = []
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        callOrder.push('syncStageAlpha')
        return Promise.resolve()
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        callOrder.push('syncStageBeta')
        return Promise.resolve()
      }),
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

  it('should call stages when stages are mixed normal functions and promises', async () => {
    const callOrder: Array<string> = []
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        callOrder.push('syncStageAlpha')
        return Promise.resolve()
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        callOrder.push('syncStageBeta')
      }),
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
})
