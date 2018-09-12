
import { hash, compare } from 'bcrypt'
import { ObjectID } from 'mongodb'
import { test as testPassword } from 'owasp-password-strength-test'
import { toObjectId } from '../../helpers/objectId'
import { BCRYPT_SALT_ROUNDS } from '../../config'
import { getCollection } from '../../db'

import {
  UserNotFoundError,
  UserExistsError,
  SetPasswordMismatchError,
  PasswordStrengthError,
} from './user.errors'
import {
  IUser,
  User,
  CreateUserRequest,
  ChangePasswordRequest,
} from './user.types'

const passwordManager = new WeakMap<User, string>()

export class UserService {
  private constructor (
    private userCollection = getCollection<IUser>('users'),
  ) {}

  static readonly instance = new UserService()

  async findAll (): Promise<User[]> {
    const users = await this.userCollection.find().toArray()
    return users.map(this.wrap$)
  }

  async findById (_id: string | ObjectID): Promise<User | null> {
    _id = toObjectId(_id)
    const user = await this.userCollection.findOne({ _id })
    return this.wrap(user)
  }

  async findById$ (_id: string | ObjectID): Promise<User> {
    const user = await this.findById(_id)
    if (user === null) {
      throw new UserNotFoundError({ _id })
    }

    return user
  }

  async findByUsername (username: string): Promise<User | null> {
    const user = await this.userCollection.findOne({ username })
    return this.wrap(user)
  }

  async findByUsername$ (username: string): Promise<User> {
    const user = await this.findByUsername(username)
    if (user === null) {
      throw new UserNotFoundError({ username })
    }

    return user
  }

  async createUser ({ username, password, verifyPassword }: CreateUserRequest): Promise<User> {
    const passwordHash = await this.validatePassword(password, verifyPassword)
    const existingUser = await this.findByUsername(username)

    if (existingUser !== null) {
      throw new UserExistsError()
    }

    const user: IUser = {
      username,
      passwordHash,
    }

    const result = await this.userCollection.insertOne(user)
    if (result.insertedCount < 1) {
      throw new Error(`User ${username} was not inserted correctly!`)
    }
    user._id = result.insertedId

    return this.wrap$(user)
  }

  async changePassword (username: string, { password, verifyPassword }: ChangePasswordRequest): Promise<User> {
    const passwordHash = await this.validatePassword(password, verifyPassword)

    const result = await this.userCollection.findOneAndUpdate(
      { username },
      { $set: { passwordHash } },
      { returnOriginal: false },
    )

    return this.wrap$(result.value!)
  }

  async checkPassword (password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }

  private async validatePassword (password: string, verifyPassword: string): Promise<string> {
    if (password !== verifyPassword) {
      throw new SetPasswordMismatchError()
    }

    const testResult = testPassword(password)
    if (!testResult.strong) {
      throw new PasswordStrengthError(testResult)
    }

    return hash(password, BCRYPT_SALT_ROUNDS)
  }

  private wrap (user: IUser | null): User | null {
    if (!user) {
      return user
    }

    return this.wrap$(user)
  }

  private wrap$ (user: IUser): User {
    const userObj = new User(user)
    passwordManager.set(userObj, user.passwordHash)
    return userObj
  }

  // private serialize (user: User): IUser {
  //   const { _id, username } = user
  //   const passwordHash = passwordManager.get(user)
  //
  //   if (!passwordHash) {
  //     throw new Error('Could not re-serialize user!')
  //   }
  //
  //   return {
  //     _id,
  //     username,
  //     passwordHash,
  //   }
  // }
}
