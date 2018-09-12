
import { ObjectID } from 'mongodb'
import { Document } from '../document/document.types'
import { toObjectId } from '../../helpers/objectId'

export class Post extends Document {
  content: string
  posterId: ObjectID

  constructor (post: IPost) {
    super(post)

    this.content = post.content
    this.posterId = toObjectId(post.posterId)
  }
}

export interface IPost extends Post {}

export interface CreatePostRequest {
  content: string
}

export interface UpdatePostRequest {
  postId: ObjectID
  data: Partial<IPost>
}
