
import { IResolvers } from 'apollo-server'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'

import { UserService } from './user.service'
import { User, CreateUserRequest } from './user.types'

export const typeDefs = gql`
  extend type Query {
    user(username: String!): User
    userById(userId: ObjectID!): User
    users: [User!]!
  }

  extend type Mutation {
    createUser(
      username: String!,
      password: String!,
      verifyPassword: String!,
    ): User!
  }

  type User implements Document {
    _id: ObjectID!
    username: String!
  }
`

const userService = UserService.instance

export const resolvers: IResolvers<User, Context> = {
  Query: {
    async user (_source, { username }): Promise<User | null> {
      return userService.findByUsername(username)
    },
    async userById (_source, { userId }): Promise<User | null> {
      return userService.findById(userId)
    },
    async users (): Promise<User[]> {
      return userService.findAll()
    },
  },
  Mutation: {
    async createUser (_source, args: CreateUserRequest): Promise<User> {
      return userService.createUser(args)
    },
  },
}
