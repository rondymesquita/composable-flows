import { Flow } from '../src'

describe('Flow with default mode', () => {
  it('should instantiate', async () => {
    expect(() => new Flow()).not.toThrow()
  })

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

  it('should continue the flow when a stage fails', async () => {
    const fakeError = new Error('stage error')
    const syncStageAlpha = {
      handle: jest.fn().mockImplementation(() => {
        throw fakeError
      }),
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

  it('should stop the flow on stage fail when stopOnError is true', async () => {
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

    const options = {
      stopOnError: true,
    }
    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle], options)

    expect(syncStageAlpha.handle).toBeCalledTimes(0)
    expect(syncStageBeta.handle).toBeCalledTimes(0)

    await expect(sut.execute()).rejects.toEqual(new Error('alpha stage error'))
    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledTimes(0)
  })

  it('should pass multiples parameters for the stage', async () => {
    const syncStageAlpha = {
      handle: jest.fn().mockReturnValue('alpha-result'),
    }

    const syncStageBeta = {
      handle: jest.fn().mockReturnValue('beta-result'),
    }

    const sut = new Flow([syncStageAlpha.handle, syncStageBeta.handle])

    const result = await sut.execute('email@email.com', 'admin')
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

    expect(syncStageAlpha.handle).toBeCalledTimes(1)
    expect(syncStageAlpha.handle).toBeCalledWith('email@email.com', 'admin')

    expect(syncStageBeta.handle).toBeCalledTimes(1)
    expect(syncStageBeta.handle).toBeCalledWith('email@email.com', 'admin')
  })

  // it('should not execute a stage if "when" returns false ', async () => {
  //   const syncStageAlpha = {
  //     handle: jest.fn().mockReturnValue('alpha-result'),
  //   }

  //   const syncStageBeta = {
  //     handle: jest.fn().mockReturnValue('beta-result'),
  //   }

  //   const sut = new Flow([
  //     {
  //       when: () => false,
  //       handler: syncStageAlpha.handle,
  //     },
  //     syncStageBeta.handle,
  //   ])

  //   expect(syncStageAlpha.handle).toBeCalledTimes(0)
  //   expect(syncStageBeta.handle).toBeCalledTimes(0)

  //   const result = await sut.execute()
  //   expect(result).toEqual({
  //     allResults: [undefined, 'beta-result'],
  //     lastResult: 'beta-result',
  //   })

  //   expect(syncStageAlpha.handle).toBeCalledTimes(0)

  //   expect(syncStageBeta.handle).toBeCalledTimes(1)
  //   expect(syncStageBeta.handle).toBeCalledWith()
  // })

  // it('should execute a stage if "when" returns true ', async () => {
  //   const syncStageAlpha = {
  //     handle: jest.fn().mockReturnValue('alpha-result'),
  //   }

  //   const syncStageBeta = {
  //     handle: jest.fn().mockReturnValue('beta-result'),
  //   }

  //   const sut = new Flow([
  //     {
  //       when: () => true,
  //       handler: syncStageAlpha.handle,
  //     },
  //     syncStageBeta.handle,
  //   ])

  //   expect(syncStageAlpha.handle).toBeCalledTimes(0)
  //   expect(syncStageBeta.handle).toBeCalledTimes(0)

  //   const result = await sut.execute()
  //   expect(result).toEqual({
  //     allResults: ['alpha-result', 'beta-result'],
  //     lastResult: 'beta-result',
  //   })

  //   expect(syncStageAlpha.handle).toBeCalledTimes(1)
  //   expect(syncStageAlpha.handle).toBeCalledWith()

  //   expect(syncStageBeta.handle).toBeCalledTimes(1)
  //   expect(syncStageBeta.handle).toBeCalledWith()
  // })

  // it('should allow "handle" to be a function with parameters', async () => {
  //   const syncStageAlpha = {
  //     handle: jest.fn((param) => 'fake').mockReturnValue('alpha-result'),
  //   }

  //   const syncStageBeta = {
  //     handle: jest.fn((param) => 'fake').mockReturnValue('beta-result'),
  //   }

  //   const sut = new Flow([
  //     {
  //       handler: syncStageAlpha.handle,
  //       when: () => true,
  //     },
  //     syncStageBeta.handle,
  //   ])

  //   expect(syncStageAlpha.handle).toBeCalledTimes(0)
  //   expect(syncStageBeta.handle).toBeCalledTimes(0)

  //   const result = await sut.execute()
  //   expect(result).toEqual({
  //     allResults: ['alpha-result', 'beta-result'],
  //     lastResult: 'beta-result',
  //   })

  //   expect(syncStageAlpha.handle).toBeCalledTimes(1)
  //   expect(syncStageAlpha.handle).toBeCalledWith()

  //   expect(syncStageBeta.handle).toBeCalledTimes(1)
  //   expect(syncStageBeta.handle).toBeCalledWith()
  // })
})
