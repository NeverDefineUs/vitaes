import { queryType, stringArg } from '@nexus/schema'

import toLegacyJSON from '../utils/legacyJson'

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
    t.field('toLegacyJSON', {
      type: 'String',
      args: {
        userVid: stringArg({ required: true })
      },
      resolve: async (_root, args, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            vid: args.userVid,
          },
          include: {
            records: {
              include: {
                RecordAcademic: {
                  include: {
                    institution: true,
                    location: true,
                  }
                },
                RecordAchievement: {
                  include: {
                    institution: true,
                    location: true,
                  }
                },
                RecordEducation: {
                  include: {
                    institution: true,
                    location: true,
                  }
                },
                RecordLanguage: true,
                RecordPersonal: true,
                RecordProject: {
                  include: {
                    location: true,
                  }
                },
                RecordSkill: true,
                RecordWork: {
                  include: {
                    institution: true,
                    location: true,
                  }
                },
              }
            }
          }
        })
        if (!user) {
          throw new Error("User not found")
        }
        
        return JSON.stringify(toLegacyJSON(user), null, 2)
      },
    })
  },
})
