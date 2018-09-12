
import { PubSub } from 'graphql-subscriptions'

export const pubsub = new PubSub()

export class BasePubSub<T> {
  constructor (
    private core = pubsub,
  ) {}

  protected publishData (event: string, data: T) {
    this.core.publish(event, data)
  }

  protected makeSubscription<K extends keyof T> (event: string, original?: { [key in K]: T[K] }): AsyncIterator<T[K]> {
    if (original === undefined) {
      return this.core.asyncIterator<T[K]>(event)
    }

    return (async function* () {
      yield original
      for await (const value of this.makeSubscription(event)) {
        yield value
      }
    }).apply(this)
  }
}
