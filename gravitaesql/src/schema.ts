import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema"
import { makeSchema, objectType } from '@nexus/schema'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.vid()
    t.model.autosave()
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: (_root, _args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, User],
  plugins: [nexusSchemaPrisma()],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
