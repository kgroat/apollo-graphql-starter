
import { ObjectID } from 'mongodb'
import { toObjectId } from '../../helpers/objectId'
import { getCollection } from '../../db'
import { User } from '../user/user.types'

import { PostNotFoundError, CannotEditPostError } from './post.errors'
import { Post, IPost, CreatePostRequest, UpdatePostRequest } from './post.types'

export class PostService {
  constructor (
    private postCollection = getCollection<IPost>('posts'),
  ) {}

  static instance = new PostService()

  async findAll (): Promise<Post[]> {
    const posts = await this.postCollection.find().toArray()
    return posts.map(this.wrap$)
  }

  async findById (_id: string | ObjectID): Promise<Post | null> {
    _id = toObjectId(_id)
    const post = await this.postCollection.findOne({ _id })
    return this.wrap(post)
  }

  async findById$ (_id: string | ObjectID): Promise<Post> {
    const post = await this.findById(_id)
    if (post === null) {
      throw new PostNotFoundError({ _id })
    }

    return post
  }

  async createPost (user: User, { content }: CreatePostRequest): Promise<Post> {
    const post: IPost = {
      content,
      posterId: user._id!,
    }

    const result = await this.postCollection.insertOne(post)
    if (result.insertedCount < 1) {
      throw new Error(`Post was not created correctly!`)
    }
    post._id = result.insertedId

    return this.wrap$(post)
  }

  async updatePost (user: User, { postId, data }: UpdatePostRequest): Promise<Post> {
    const existingPost = await this.findById$(postId)
    if (!existingPost.posterId.equals(user._id!)) {
      throw new CannotEditPostError()
    }

    const result = await this.postCollection.findOneAndUpdate(
      { _id: postId, posterId: user._id },
      { $set: data },
      { returnOriginal: false },
    )

    return this.wrap$(result.value!)
  }

  private wrap (post: IPost | null): Post | null {
    if (!post) {
      return post
    }

    return this.wrap$(post)
  }

  private wrap$ (post: IPost): Post {
    return new Post(post)
  }
}
