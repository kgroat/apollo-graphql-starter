
import { IResolvers } from 'apollo-server'
import { authorize } from '../../helpers/authorize'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'
import { User } from '../user/user.types'
import { UserService } from '../user/user.service'

import { PostService } from './post.service'
import { PostPubSub } from './post.pubsub'
import { Post, CreatePostRequest, UpdatePostRequest } from './post.types'

export const typeDefs = gql`
  extend type Query {
    posts: [Post!]!
    post (postId: ObjectID!): Post!
  }

  extend type Mutation {
    createPost (content: String!): Post!
    updatePost (postId: ObjectID!, data: UpdatePost!): Post!
  }

  extend type Subscription {
    post (postId: ObjectID!): Post!
  }

  input UpdatePost {
    content: String
  }

  type Post implements Document {
    _id: ObjectID!
    content: String!
    poster: User!
  }
`

export const resolvers: IResolvers<Post, Context> = {
  Query: {
    async posts (): Promise<Post[]> {
      const posts = await PostService.instance.findAll()
      return posts
    },
    async post (_source, { postId }): Promise<Post | null> {
      return PostService.instance.findById(postId)
    },
  },
  Mutation: {
    async createPost (_source, args: CreatePostRequest, ctx): Promise<Post> {
      const user = await authorize(ctx)
      return PostService.instance.createPost(user, args)
    },
    async updatePost (_source, args: UpdatePostRequest, ctx): Promise<Post> {
      const user = await authorize(ctx)
      const post = await PostService.instance.updatePost(user, args)
      PostPubSub.instance.publishUpdate(post)
      return post
    },
  },
  Subscription: {
    post: {
      async subscribe (_source, { postId }) {
        const post = await PostService.instance.findById$(postId)
        return PostPubSub.instance.listenForUpdates(post)
      },
    },
  },
  Post: {
    async poster (source): Promise<User> {
      return UserService.instance.findById$(source.posterId)
    },
  },
}
