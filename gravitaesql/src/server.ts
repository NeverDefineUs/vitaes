import { ApolloServer } from 'apollo-server'

import { schema } from './schema'
import { createContext } from './context'
import { initNtpUlidSync } from './utils/ntpUlid'

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
