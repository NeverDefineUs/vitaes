import { ApolloServer } from 'apollo-server'
import { initNtpUlidSync } from 'ntp-ulid'

import { schema } from './schema'
import { createContext } from './context'

initNtpUlidSync()

new ApolloServer({
  schema,
  context: async ({ req }) => await createContext(req),
}).listen(
  { port: 4000 },
  () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000`,
    ),
)
