import { FlowOptions, Flow } from '../src'
describe('Flow with default mode - callbacks', () => {
  it('should call allFail when all stages fail', async () => {
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
    await sut.allFail(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith([
      new Error('alpha stage error'),
      new Error('beta stage error'),
    ])
  })

  it('should not call allFail when any stage is ok', async () => {
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
    await sut.allFail(spy)
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call anyFail when any stage fails', async () => {
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
    await sut.anyFail(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith([new Error('alpha stage error')])
  })

  it('should call anyFail when all stages fail', async () => {
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
    await sut.anyFail(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith([
      new Error('alpha stage error'),
      new Error('beta stage error'),
    ])
  })

  it('should not call anyFail when all stages are ok', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.anyFail(spy)
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('should call fail with the error of a stage when getting by index', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('beta stage error'))
      }),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])
    await sut.execute()
    const spy = jest.fn()
    await sut.fail(1, spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(new Error('beta stage error'))
  })

  it('should call fail with the error of a stage when getting by name', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('alpha stage error'))
      }),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([
      { 'alpha-stage-name': syncStageAlpha.handle },
      syncStageBeta.handle,
    ])
    await sut.execute()
    const spy = jest.fn()
    await sut.fail('alpha-stage-name', spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(new Error('alpha stage error'))
  })

  it('should call fail with undefined when stage is not found by index', async () => {
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

  it('should call fail with an undefined when stage is not found by name', async () => {
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
