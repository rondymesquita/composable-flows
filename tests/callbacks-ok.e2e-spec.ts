import { FlowOptions, Flow } from '../src'
describe('Flow with default mode - callbacks', () => {
  it('should call allOk when all stages are ok', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.allOk(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['alpha-result', 'beta-result'])
  })
  it('should not call allOk when any stage throws error', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.allOk(spy)
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call anyOk when any stage is ok', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.anyOk(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['beta-result'])
  })

  it('should call anyOk when all stages are ok', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.anyOk(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['alpha-result', 'beta-result'])
  })

  it('should not call anyOk when all stages are throw error', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('beta stage error'))
      }),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.anyOk(spy)
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('should call ok with the result of a stage when getting by index', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.ok(0, spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('alpha-result')
  })

  it('should call ok with the result of a stage when getting by name', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([
      syncStageAlpha.handle,
      { 'beta-stage-name': syncStageBeta.handle },
    ])
    await sut.execute()
    const spy = jest.fn()
    await sut.ok('beta-stage-name', spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('beta-result')
  })

  it('should call ok with undefined when stage is not found by index', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.ok(2, spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(undefined)
  })

  it('should call ok with undefined when stage is not found by name', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([
      syncStageAlpha.handle,
      { 'beta-stage-name': syncStageBeta.handle },
    ])
    await sut.execute()
    const spy = jest.fn()
    await sut.ok('unknown-stage-name', spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(undefined)
  })
})
