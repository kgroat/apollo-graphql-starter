
import { IResolvers } from 'apollo-server'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'
import { UserService } from '../user/user.service'

import { AuthService } from './auth.service'
import { LoginRequest, LoginResponse } from './auth.types'

export const typeDefs = gql`
  extend type Mutation {
    login (username: String!, password: String!): LoginResponse
  }

  type LoginResponse {
    token: String
    user: User
  }
`

export const authResolvers = {
  Mutation: {
    login: {
      description: 'Used to authenticate a user and retrieve a `JWT` token used to authorize further requests.',
      async resolve (_source: any, { username, password }: LoginRequest): Promise<LoginResponse> {
        const user = await UserService.instance.checkPassword(username, password)
        const token = await AuthService.instance.encodeJwt({ _id: user._id! })

        return {
          token,
          user,
        }
      },
    },
  },
}

export const resolvers: IResolvers<LoginRequest, Context> = authResolvers
