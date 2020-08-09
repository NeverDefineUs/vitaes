import { queryType } from '@nexus/schema'

export default queryType({
  definition(t) {
    t.field('currentUser', {
      type: 'User',
      resolve: async (_root, _args, ctx) => {
        const firebaseId = ctx.firebaseId
        if (!firebaseId) {
          throw new Error("User not authenticated")
        }
        
        const user = await ctx.prisma.user.findOne({
          where: {
            firebaseId: firebaseId,
          }
        })
        if (!user) {
          throw new Error("User not found")
        }
        return user
      },
    })
  },
})
