import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema"
import { decorateType, makeSchema } from '@nexus/schema'
import { GraphQLDate } from 'graphql-scalars'

import models from './models'
import { RootQuery } from './query'

export const GQLDate = decorateType(GraphQLDate, {
  rootTyping: 'DateTime',
  asNexusMethod: 'date',
})

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
