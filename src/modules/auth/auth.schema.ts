
import { IResolvers } from 'apollo-server'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'

import { AuthService } from './auth.service'
import { LoginResponse } from './auth.types'

export const typeDefs = gql`
  extend type Mutation {
    login(username: String!, password: String!): LoginResponse
  }

  type LoginResponse {
    token: String
    user: User
  }
`

const authService = AuthService.instance

export const resolvers: IResolvers<any, Context> = {
  Mutation: {
    async login (_source, { username, password }): Promise<LoginResponse> {
      const user = await authService.checkPassword(username, password)
      const token = await authService.encodeJwt({ _id: user._id! })

      return {
        token,
        user,
      }
    },
  },
}
