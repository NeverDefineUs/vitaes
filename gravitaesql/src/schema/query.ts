import { objectType } from '@nexus/schema'

const RootQuery = objectType({
  name: 'Query',
  definition(t) {
    t.field('current_user', {
      type: 'User',
      resolve: async (_root, _args, ctx) => {
        const userId = ctx.userId
        if (!userId) {
          throw new Error("User not authenticated")
        }
        
        const user = await ctx.prisma.user.findOne({
          where: {
            firebaseId: userId,
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

export {
  RootQuery,
}
