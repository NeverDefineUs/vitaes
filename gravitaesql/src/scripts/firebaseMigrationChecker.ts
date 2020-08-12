import { PrismaClient } from '@prisma/client'
import { exit } from 'process'
import sortKeys from 'sort-keys'
import { Md5 } from 'md5-typescript'

import admin from '../firebase'
import toLegacyJSON from '../utils/legacyJson'

const prisma = new PrismaClient()

async function fetchMysqlUsers() {
  const users = await prisma.user.findMany({
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

  let json: any = {}
  users.reduce((acc, user) => {
    acc[user.firebaseId] = toLegacyJSON(user)
    return acc
  }, json)
  json = sortKeys(json)

  return json
}

function sortJson(json: any): void {
  Object.keys(json).forEach(user => {
    const data = json[user]

    delete data.user_cv_model
    delete data.params

    if (data.cv.header?.birthday) {
      data.cv.header.birthday = data.cv.header.birthday
        .replace('/', '-')
        .replace('/', '-')
    }

    Object.keys(data.cv).filter(key => key !== 'header').forEach(kind => {
      const arr = data.cv[kind]

      let md5Map = Array.from<any>(arr)
        .map(item => {
          if (!item.disable) {
            delete item.disable
          }

          Object.keys(item).forEach(field => {
            if (field.endsWith('date')) {
              item[field] =  item[field]
                .replace('/', '-')
                .replace('/', '-')
            }
          })

          return item
        })
        .reduce(
          (acc, item) => (acc[Md5.init(JSON.stringify(item))] = item, acc),
          {}
        )
      md5Map = sortKeys(md5Map)

      data.cv[kind] = Object.values(md5Map)
    })
  })
}

async function check() {
  const ref = admin.database().ref()
  const db = (await ref.once('value')).val()

  const firebaseUsers = db['users']
  const mysqlUsers = await fetchMysqlUsers()

  sortJson(firebaseUsers)
  sortJson(mysqlUsers)

  if (JSON.stringify(firebaseUsers) === JSON.stringify(mysqlUsers)) {
    console.log('data match')
  } else {
    console.log('data didn\'t match')
  }

  exit()
}

check()