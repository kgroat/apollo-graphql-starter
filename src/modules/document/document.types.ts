
import { ObjectID } from 'mongodb'

export class Document {
  _id?: ObjectID

  constructor (doc: IDocument) {
    this._id = doc._id
  }
}

export interface IDocument extends Partial<Document> {}
