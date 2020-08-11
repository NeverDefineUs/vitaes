import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import { ulid } from 'ntp-ulid'

import admin from '../firebase'
import { exit } from 'process'

const prisma = new PrismaClient()

let adminsFirebaseId: string[]

const locateAdmins = async (permissions: any) => {
  adminsFirebaseId = Object.keys(permissions)
}

const migrateBugReports = async (bugs: Object) => {
  const promises = Object.values(bugs).map(async bug => {
    let authorConnect = null
    if (bug.email) {
      const author = (await prisma.user.findMany({
        where: {
          recordSets: {
            every: {
              personalInfo: {
                email: {
                  equals: bug.email
                }
              }
            }
          }
        }
      }))[0]
      if (author) {
        authorConnect = {
          connect: {
            vid: author.vid
          }
        }
      }
    }

    return await prisma.bugReport.create({
      data: {
        vid: ulid(),
        author: authorConnect,
        email: bug.email,
        title: bug.title,
        data: JSON.stringify(bug.data),
      }
    })
  })
  await Promise.all(promises)
  console.log("done with bugs")
}

const migrateMessages = async (messages: Object) => {
  const promises = Object.values(messages).map(async message => {
    return await prisma.alert.create({
      data: {
        vid: ulid(),
        author: {
          connect: {
            firebaseId: adminsFirebaseId[Math.floor(Math.random() * adminsFirebaseId.length)]
          }
        },
        message: message.en,
        type: message.type.toUpperCase(),
      }
    })
  })
  await Promise.all(promises)
  console.log("done with alerts")
}

const migrateUsers = async (users: Object) => {
  const promises = Object.entries(users).map(async entry => {
    const firebaseId = entry[0]
    const user = entry[1]

    return await prisma.user.create({
      data: {
        vid: ulid(),
        firebaseId: firebaseId,
        autosave: user.autosave,
        recordSets: {
          create: {
            vid: ulid(),
            mainSet: true,
            sectionOrder: JSON.stringify(user.cv_order),
            personalInfo: parsePersonalInfo(user.cv.header),
            academicRecords: parseAcademic(user.cv.academic),
            achievementRecords: parseAchievement(user.cv.achievement),
            educationRecords: parseEducation(user.cv.education),
            languageRecords: parseLanguage(user.cv.language),
            projectRecords: parseProject(user.cv.project),
            skillRecords: parseSkill(user.cv.skill),
            workRecords: parseWork(user.cv.work),
          }
        }
      }
    })
  })
  await Promise.all(promises)
  console.log("done with users")
}

const parsePersonalInfo = (header: any): any => {
  if (!header) {
    return null
  }

  return {
    create: {
      vid: ulid(),
      name: header?.name,
      email: header?.email,
      homepage: header?.homepage,
      phone: header?.phone,
      address: header?.address,
      linkedin: header?.linkedin,
      github: header?.github,
      birthday: parseDate(header?.birthday),
    }
  }
}

const parseAcademic = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(academic => ({
      vid: ulid(),
      title: academic?.name,
      startDate: parseDate(academic?.start_date) ?? new Date(),
      endDate: parseDate(academic?.end_date),
      description: academic?.description,
      articleLink: academic?.article_link,
      hidden: academic?.disable ?? false,
      institution: parseInstitution(academic?.institution),
      location: parseLocation(academic?.location),
    }))
  }
}

const parseAchievement = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(achievement => ({
      vid: ulid(),
      title: achievement?.name,
      startDate: parseDate(achievement?.start_date) ?? new Date(),
      endDate: parseDate(achievement?.end_date),
      description: achievement?.description,
      position: achievement?.position,
      certificateLink: achievement?.certificate_link,
      hidden: achievement?.disable ?? false,
      institution: parseInstitution(achievement?.institution),
      location: parseLocation(achievement?.location),
    }))
  }
}

const parseEducation = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(education => ({
      vid: ulid(),
      course: education?.course,
      startDate: parseDate(education?.start_date) ?? new Date(),
      endDate: parseDate(education?.end_date),
      description: education?.description,
      teacher: education?.teacher,
      hidden: education?.disable ?? false,
      institution: parseInstitution(education?.institution),
      location: parseLocation(education?.location),
    }))
  }
}

const parseLanguage = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(language => ({
      vid: ulid(),
      name: language?.language,
      level: language?.level,
      hidden: language?.disable ?? false,
    }))
  }
}

const parseProject = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(project => ({
      vid: ulid(),
      title: project?.name,
      startDate: parseDate(project?.start_date) ?? new Date(),
      endDate: parseDate(project?.end_date),
      description: project?.description,
      programmingLanguage: project?.language,
      repositoryLink: project?.repository_link,
      hidden: project?.disable ?? false,
      location: parseLocation(project?.location),
    }))
  }
}

const parseSkill = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(skill => ({
      vid: ulid(),
      name: skill?.skill_name,
      type: skill?.skill_type,
      level: skill?.level,
      hidden: skill?.disable,
    }))
  }
}

const parseWork = (records: any): any => {
  if (!records) {
    return null
  }

  return {
    create: Array.from<any>(records).map(work => ({
      vid: ulid(),
      role: work?.role,
      startDate: parseDate(work?.start_date) ?? new Date(),
      endDate: parseDate(work?.end_date),
      description: work?.description,
      hidden: work?.disable ?? false,
      institution: parseInstitution(work?.institution),
      location: parseLocation(work?.location),
    }))
  }
}

const parseDate = (dateString: any): any => {
  if (!dateString) {
    return null
  }
  return moment.utc(dateString, 'YYYY-MM-DD').toDate()
}

const parseInstitution = (institution: any): any => {
  if (!institution) {
    return null
  }
  return {
    create: {
      vid: ulid(),
      name: institution?.name,
    }
  }
}

const parseLocation = (location: any): any => {
  if (!location) {
    return null
  }
  return {
    create: {
      vid: ulid(),
      country: location?.country,
      governingDistrict: location?.state,
      cityTown: location?.city,
    }
  }
}

const migrate = async () => {
  const ref = admin.database().ref()
  const db = (await ref.once('value')).val()

  await migrateUsers(db['users'])
  await locateAdmins(db['permissions'])
  await migrateBugReports(db['bug'])
  await migrateMessages(db['messages'])

  exit()
}

migrate()
