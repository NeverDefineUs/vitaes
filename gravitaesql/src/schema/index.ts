import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema"
import { makeSchema } from '@nexus/schema'

import models from './models'
import { RootQuery } from './root'

export const schema = makeSchema({
  types: [models, RootQuery],
  plugins: [nexusSchemaPrisma()],
  outputs: {
    schema: __dirname + '/../../schema.graphql',
    typegen: __dirname + '/../generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('../context'),
        alias: 'Context',
      },
    ],
  },
})