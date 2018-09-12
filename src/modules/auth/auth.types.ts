
import { ObjectID } from 'mongodb'
import { User } from '../user/user.types'

export interface JwtPayload {
  _id: ObjectID
}

export interface LoginResponse {
  token: string
  user: User
}
