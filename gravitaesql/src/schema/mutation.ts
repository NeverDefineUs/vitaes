import { mutationType, stringArg } from '@nexus/schema'
import { ulid } from 'ntp-ulid'

import { defaultRecordsOrder, defaultSectionOrder } from '../utils/collectionRecords'
import { resolveLegacyJson } from '../utils/legacyJsonExport'
import { updateUser } from '../utils/legacyJsonImport'

export default mutationType({
  definition(t) {
    t.field('createUser', {
      type: 'String',
      args: {
        vid: stringArg()
      },
      resolve: async (_root, args, ctx) => {
        const firebaseId = ctx.firebaseId
        if (!firebaseId) {
          throw new Error("User not authenticated")
        }

        const vid = args.vid ?? ulid()
        await ctx.prisma.user.create({
          data: {
            vid,
            firebaseId,
            recordsOrder: defaultRecordsOrder,
            sectionOrder: defaultSectionOrder,
          },
        })

        return await resolveLegacyJson(ctx, {
          vid: vid,
        })
      }
    })
    t.field('updateUser', {
      type: 'Boolean',
      args: {
        legacyJson: stringArg({ required: true })
      },
      resolve: async (_root, args, ctx) => {
        const firebaseId = ctx.firebaseId
        if (!firebaseId) {
          throw new Error("User not authenticated")
        }

        await updateUser(ctx, firebaseId, args.legacyJson)

        return true
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
