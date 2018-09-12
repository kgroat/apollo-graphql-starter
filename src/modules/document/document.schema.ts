
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { IResolvers } from 'apollo-server'
import { ObjectID } from 'mongodb'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'

import { Document } from './document.types'

export const typeDefs = gql`
  scalar ObjectID

  interface Document {
    _id: ObjectID!
  }
`

export const resolvers: IResolvers<Document, Context> = {
  ObjectID: new GraphQLScalarType({
    name: 'ObjectID',
    description: 'A BSON id data type',
    serialize (_id): string {
      if (_id instanceof ObjectID) {
        return _id.toHexString()
      } else if (typeof _id === 'string') {
        return _id
      } else {
        throw new Error(`${Object.getPrototypeOf(_id).constructor.name} not convertible to `)
      }
    },
    parseValue (_id): ObjectID {
      if (typeof _id === 'string') {
        return ObjectID.createFromHexString(_id)
      } else {
        throw new Error(`${typeof _id} not convertible to ObjectID`)
      }
    },
    parseLiteral (ast): ObjectID {
      if (ast.kind === Kind.STRING) {
        return ObjectID.createFromHexString(ast.value)
      } else {
        throw new Error(`${ast.kind} not convertible to ObjectID`)
      }
    },
  }),
}
