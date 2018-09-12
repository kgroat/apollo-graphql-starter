
import { Document } from '../document/document.types'

import { UserService } from './user.service'

const passwordHash = Symbol('passwordHash')

export class User extends Document {
  username: string
  private [passwordHash]: string

  constructor (user: IUser) {
    super(user)
    this.username = user.username
    this[passwordHash] = (user as any).passwordHash
  }

  async checkPassword (password: string) {
    return UserService.instance.checkPassword(password, this[passwordHash])
  }
}

export interface IUser extends Document {
  username: string
  passwordHash: string
}

export interface CreateUserRequest {
  username: string
  password: string
  verifyPassword: string
}

export interface ChangePasswordRequest {
  password: string
  verifyPassword: string
}
