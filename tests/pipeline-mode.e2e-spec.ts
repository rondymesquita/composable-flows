import { Flow, FlowMode } from '../src'

describe('Flow with pipeline mode', () => {
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
      allResults: ['alpha-result', 'beta-result', 'gamma-result'],
      lastResult: 'gamma-result',
    })

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith()

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith('alpha-result')

    expect(syncStageGamma.handle).toBeCalledTimes(1)
    expect(syncStageGamma.handle).toBeCalledWith('beta-result')
  })

  it('should pass multiples parameters for the stage', async () => {
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
      allResults: ['alpha-result', 'beta-result', 'gamma-result'],
      lastResult: 'gamma-result',
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

  it('should stop the execution of remaining stages when fails', async () => {
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
      mode: FlowMode.PIPELINE,
      stopOnError: false,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

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
    expect(syncStageBeta.handle).toBeCalledWith(undefined)

    expect(callOrder).toEqual(['syncStageAlpha', 'syncStageBeta'])
  })
})
