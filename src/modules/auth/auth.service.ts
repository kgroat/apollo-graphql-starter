
import { sign, verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../../config'
import { objectIdToString, toObjectId } from '../../helpers/objectId'
import { UserService } from '../user/user.service'
import { User } from '../user/user.types'

import { JwtPayload } from './auth.types'
import { LoginError } from './auth.errors'

const JWT_ALG = 'HS512'
const JWT_VALID_FOR = '10 days'

export class AuthService {
  private constructor (
    private userService = UserService.instance,
  ) {}

  static readonly instance = new AuthService()

  async checkPassword (username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username)
    if (!user) {
      throw new LoginError()
    }

    const passwordsMatch = await user.checkPassword(password)
    if (!passwordsMatch) {
      throw new LoginError()
    }

    return user
  }

  async encodeJwt (payload: JwtPayload): Promise<string> {
    const _id = objectIdToString(payload._id)
    return new Promise<string>((resolve, reject) => {
      sign({ ...payload, _id }, JWT_SECRET, { algorithm: JWT_ALG, expiresIn: JWT_VALID_FOR }, (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    })
  }

  async decodeJwt (token: string): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
      verify(token, JWT_SECRET, { algorithms: [JWT_ALG] }, (err, payload: JwtPayload) => {
        if (err) {
          reject(err)
        } else {
          const _id = toObjectId(payload._id)
          resolve({ ...payload, _id })
        }
      })
    })
  }
}
