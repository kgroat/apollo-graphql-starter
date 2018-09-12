
import { dbPromise } from './db'

(Symbol as any).asyncIterator = Symbol('asyncIterator')

dbPromise.then(() => {
  require('./server')
}).catch((err) => {
  console.error('Something went wrong during app bootstrap')
  console.error(err)
  process.exit(1)
})
