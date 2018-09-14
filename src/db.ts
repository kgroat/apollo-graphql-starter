
import 'reflect-metadata'
import { connect, Db, Collection } from 'mongodb'
export { ObjectID } from 'mongodb'

import { MONGO_URI } from './config'

export let db: Db

console.log('connecting to mongodb...')
export let dbPromise = connect(MONGO_URI, { useNewUrlParser: true }).then(client => {
  db = client.db()
  return db
})
dbPromise.then(db => {
  console.log('connected to mongodb database:', db.databaseName)
}).catch()

export function getCollection<T> (collectionName: string): Collection<T> {
  return db.collection<T>(collectionName)
}
