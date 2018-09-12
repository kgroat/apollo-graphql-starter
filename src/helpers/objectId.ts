
import { ObjectID } from 'mongodb'

export function toObjectId (id: string | ObjectID): ObjectID {
  if (id instanceof ObjectID) {
    return id
  } else {
    return new ObjectID(id)
  }
}

export function objectIdToString (id: string | ObjectID): string {
  if (id instanceof ObjectID) {
    return id.toHexString()
  } else {
    return id
  }
}
