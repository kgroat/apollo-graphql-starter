
import { ObjectID } from 'mongodb'
import { objectIdToString } from '../../helpers/objectId'
import { BasePubSub } from '../../pubsub'

import { Post } from './post.types'

export interface UpdatePostData {
  post: Post
}

export class PostPubSub extends BasePubSub<UpdatePostData> {
  static instance = new PostPubSub()

  listenForUpdates (post: Post) {
    return this.makeSubscription(this.UPDATE_CODE(post._id!), {
      post,
    })
  }

  publishUpdate (post: Post) {
    this.publishData(this.UPDATE_CODE(post._id!), {
      post,
    })
  }

  private UPDATE_CODE (postId: string | ObjectID) {
    return `POST:UPDATE:${objectIdToString(postId)}`
  }
}
