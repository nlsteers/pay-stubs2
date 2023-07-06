import type { NextApiRequest, NextApiResponse } from 'next';
import doAuthorise from '../middleware/doAuthorise';

const STUB_USER = 'user'
const STUB_PASSWORD = 'password'

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {
    stubsUsername: 'user',
    stubsPassword: 'password',
  },
}))

describe('doAuthorise', () => {
  let handlerMock: jest.Mock<void, [NextApiRequest, NextApiResponse]>
  let reqMock: Partial<NextApiRequest>
  let resMock: Partial<NextApiResponse>
  const originalConsole = console.warn

  beforeEach(() => {
    // suppress console output for these tests
    console.warn = jest.fn()
    handlerMock = jest.fn()
    reqMock = {
      headers: {},
    }
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    console.warn = originalConsole
    jest.clearAllMocks()
  })

  it('should call the handler if authorization is valid', async () => {
    reqMock.headers = { authorization: `Basic ${Buffer.from(`${STUB_USER}:${STUB_PASSWORD}`).toString('base64')}` }

    await doAuthorise(handlerMock)(reqMock as NextApiRequest, resMock as NextApiResponse)

    expect(handlerMock).toHaveBeenCalledWith(reqMock as NextApiRequest, resMock as NextApiResponse)
    expect(resMock.status).not.toHaveBeenCalled()
    expect(resMock.json).not.toHaveBeenCalled()
  })

  it('should return 401 if authorization header is missing', async () => {
    await doAuthorise(handlerMock)(reqMock as NextApiRequest, resMock as NextApiResponse)

    expect(handlerMock).not.toHaveBeenCalled()
    expect(resMock.status).toHaveBeenCalledWith(401)
    expect(resMock.json).toHaveBeenCalledWith({ message: 'authorisation failed' })
  })

  it('should return 401 if authorization header has unexpected type', async () => {
    reqMock.headers = { authorization: 'Bearer token' }

    await doAuthorise(handlerMock)(reqMock as NextApiRequest, resMock as NextApiResponse)

    expect(handlerMock).not.toHaveBeenCalled()
    expect(resMock.status).toHaveBeenCalledWith(401)
    expect(resMock.json).toHaveBeenCalledWith({ message: 'authorisation failed' })
  })

  it('should return 401 if authorization decoding fails', async () => {
    reqMock.headers = { authorization: 'Basic invalidBase64String' }

    await doAuthorise(handlerMock)(reqMock as NextApiRequest, resMock as NextApiResponse)

    expect(handlerMock).not.toHaveBeenCalled()
    expect(resMock.status).toHaveBeenCalledWith(401)
    expect(resMock.json).toHaveBeenCalledWith({ message: 'authorisation failed' })
  })

  it('should return 401 if authorization object does not match expected values', async () => {
    reqMock.headers = { authorization: `Basic ${Buffer.from('wrongUser:wrongPassword').toString('base64')}` }

    await doAuthorise(handlerMock)(reqMock as NextApiRequest, resMock as NextApiResponse)

    expect(handlerMock).not.toHaveBeenCalled()
    expect(resMock.status).toHaveBeenCalledWith(401)
    expect(resMock.json).toHaveBeenCalledWith({ message: 'authorisation failed' })
  })
})
