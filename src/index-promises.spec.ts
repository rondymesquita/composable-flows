import { Compose } from '.'

describe('Compose', () => {
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

    const param = 'email@email.com'

    const sut = new Compose([syncStageAlpha.handle, syncStageBeta.handle])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
    await sut.execute(param)

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith(param)

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith(param)

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

    const param = 'email@email.com'

    const sut = new Compose([syncStageAlpha.handle, syncStageBeta.handle])

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
    await sut.execute(param)

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith(param)

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith(param)

    expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta'])
  })
})
