
import { ObjectID } from 'mongodb'
import { UserService } from '../../user/user.service'
import { AuthService } from '../auth.service'

import { authResolvers } from '../auth.schema'

jest.mock('../auth.service')
jest.mock('../../user/user.service')

describe('auth schema resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('Mutation', () => {
    describe('login', () => {
      it('should call UserService:checkPassword once', async () => {
        const username = 'some_user'
        const password = 'test password'
        await authResolvers.Mutation.login.resolve({}, {
          username,
          password,
        })

        const checkPassword = UserService.instance.checkPassword as jest.Mock
        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledWith(username, password)
      })

      it('should call AuthService:encodeJwt once', async () => {
        const username = 'some_user'
        const password = 'test password'
        await authResolvers.Mutation.login.resolve({}, {
          username,
          password,
        })

        const encodeJwt = AuthService.instance.encodeJwt as jest.Mock
        expect(encodeJwt).toHaveBeenCalledTimes(1)
        expect(encodeJwt.mock.calls[0][0]._id).toBeInstanceOf(ObjectID)
      })

      it('should return an object with token and user props', async () => {
        const username = 'some_user'
        const password = 'test password'
        const response = await authResolvers.Mutation.login.resolve({}, {
          username,
          password,
        })

        expect(response).toBeDefined()
        expect(typeof response.token).toBe('string')
        expect(response.user.username).toBe(username)
      })
    })
  })
})
