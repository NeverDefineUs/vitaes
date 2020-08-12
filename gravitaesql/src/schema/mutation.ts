import { mutationType, stringArg } from '@nexus/schema'

export default mutationType({
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args: {
        vid: stringArg({ required: true })
      },
      resolve: (_root, args, ctx) => {
        const firebaseId = ctx.firebaseId
        if (!firebaseId) {
          throw new Error("User not authenticated")
        }

        return ctx.prisma.user.create({
          data: {
            vid: args.vid,
            firebaseId: firebaseId,
          },
        })
      }
    })
  
    t.crud.createOneCV()
    t.crud.createOneRecordAcademic()
    t.crud.createOneRecordAchievement()
    t.crud.createOneRecordEducation()
    t.crud.createOneRecordLanguage()
    t.crud.createOneRecordPersonal()
    t.crud.createOneRecordProject()
    t.crud.createOneRecordSkill()
    t.crud.createOneRecordWork()
    t.crud.createOneBugReport()
    t.crud.createOneAlert()
    t.crud.createOneGatekeeper()

    t.crud.updateOneCV()
    t.crud.updateOneRecordAcademic()
    t.crud.updateOneRecordAchievement()
    t.crud.updateOneRecordEducation()
    t.crud.updateOneRecordLanguage()
    t.crud.updateOneRecordPersonal()
    t.crud.updateOneRecordProject()
    t.crud.updateOneRecordSkill()
    t.crud.updateOneRecordWork()
    t.crud.updateOneAlert()
    t.crud.updateOneGatekeeper()
  },
})
