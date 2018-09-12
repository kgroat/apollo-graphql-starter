
import { ApolloServer } from 'apollo-server'

import { PORT } from './config'
import schema from './schema'
import { contextFunction } from './context'

let server = new ApolloServer({
  schema,
  context: contextFunction,
  formatError: (err: any) => {
    return err
  },
})

const startServer = async () => {
  console.log('starting server...')
  const info = await server.listen(PORT)
  console.log(`server listening on port ${info.port}`)
}

/* tslint:disable-next-line:no-floating-promises */
startServer()
