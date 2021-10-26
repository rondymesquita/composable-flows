import { ComposableFlow, Mode } from '../src'

describe('ComposableFlow with pipeline mode', () => {
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
      mode: Mode.PIPELINE,
    }
    const sut = new ComposableFlow(
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
    expect(syncStageAlpha.handle).toBeCalledWith(undefined)

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith('alpha-result')

    expect(syncStageGamma.handle).toBeCalledTimes(1)
    expect(syncStageGamma.handle).toBeCalledWith('beta-result')
  })
})
