import { queryType, stringArg } from '@nexus/schema'

import { resolveLegacyJson } from '../utils/legacyJsonExport'

export default queryType({
  definition(t) {
    t.field('currentUser', {
      type: 'String',
      resolve: async (_root, _args, ctx) => {
        const firebaseId = ctx.firebaseId
        if (!firebaseId) {
          throw new Error("User not authenticated")
        }

        return await resolveLegacyJson(ctx, {
          firebaseId,
        })
      },
    })
    t.field('legacyJSON', {
      type: 'String',
      args: {
        userVid: stringArg({ required: true })
      },
      resolve: async (_root, args, ctx) => {
        return await resolveLegacyJson(ctx, {
          vid: args.userVid,
        })
      },
    })
  },
})
