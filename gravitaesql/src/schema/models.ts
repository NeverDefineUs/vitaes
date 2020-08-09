import { objectType } from '@nexus/schema'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.vid()
    t.model.firebaseId()
    t.model.autosave()

    t.model.recordSets()
    t.model.gatekeepers()
  },
})

const RecordSet = objectType({
  name: 'RecordSet',
  definition(t) {
    t.model.vid()
    t.model.mainSet()
    t.model.title()
    t.model.sectionOrder()

    t.model.academicRecords()
    t.model.achievementRecords()
    t.model.educationRecords()
    t.model.languageRecords()
    t.model.projectRecords()
    t.model.skillRecords()
    t.model.workRecords()

    t.model.owner()
  },
})

const RecordAcademic = objectType({
  name: 'RecordAcademic',
  definition(t) {
    t.model.vid()
    t.model.title()
    t.model.startDate()
    t.model.endDate()
    t.model.description()
    t.model.articleLink()

    t.model.location()
    t.model.institution()

    t.model.recordSets()
  },
})

const RecordAchievement = objectType({
  name: 'RecordAchievement',
  definition(t) {
    t.model.vid()
    t.model.title()
    t.model.startDate()
    t.model.endDate()
    t.model.description()
    t.model.position()
    t.model.certificateLink()

    t.model.location()
    t.model.institution()

    t.model.recordSets()
  },
})

const RecordEducation = objectType({
  name: 'RecordEducation',
  definition(t) {
    t.model.vid()
    t.model.course()
    t.model.startDate()
    t.model.endDate()
    t.model.description()
    t.model.teacher()

    t.model.location()
    t.model.institution()

    t.model.recordSets()
  },
})

const RecordLanguage = objectType({
  name: 'RecordLanguage',
  definition(t) {
    t.model.vid()
    t.model.name()
    t.model.level()

    t.model.recordSets()
  },
})

const RecordProject = objectType({
  name: 'RecordProject',
  definition(t) {
    t.model.vid()
    t.model.title()
    t.model.startDate()
    t.model.endDate()
    t.model.description()
    t.model.programmingLanguage()
    t.model.repositoryLink()

    t.model.location()

    t.model.recordSets()
  },
})

const RecordSkill = objectType({
  name: 'RecordSkill',
  definition(t) {
    t.model.vid()
    t.model.name()
    t.model.type()
    t.model.level()

    t.model.recordSets()
  },
})

const RecordWork = objectType({
  name: 'RecordWork',
  definition(t) {
    t.model.vid()
    t.model.role()
    t.model.startDate()
    t.model.endDate()
    t.model.description()

    t.model.location()
    t.model.institution()

    t.model.recordSets()
  },
})

const Institution = objectType({
  name: 'Institution',
  definition(t) {
    t.model.vid()
    t.model.name()
    t.model.abbreviaton()
  },
})

const Location = objectType({
  name: 'Location',
  definition(t) {
    t.model.vid()
    t.model.country()
    t.model.governingDistrict()
    t.model.cityTown()
  },
})

const BugReport = objectType({
  name: 'BugReport',
  definition(t) {
    t.model.vid()
    t.model.title()
    t.model.email()
    t.model.description()
    t.model.data()

    t.model.author()
  },
})

const Alert = objectType({
  name: 'Alert',
  definition(t) {
    t.model.vid()
    t.model.message()
    t.model.type()

    t.model.author()
  },
})

const Gatekeeper = objectType({
  name: 'Gatekeeper',
  definition(t) {
    t.model.vid()
    t.model.name()
    t.model.description()
  },
})

const Template = objectType({
  name: 'Template',
  definition(t) {
    t.model.vid()
    t.model.name()
    t.model.baseFolder()
    t.model.command()

    t.model.params()
  },
})

const TemplateParam = objectType({
  name: 'TemplateParam',
  definition(t) {
    t.model.vid()
    t.model.name()
    t.model.displayName()
    t.model.defaultValue()
    t.model.values()

    t.model.template()
  },
})

export default [
  User,
  RecordSet,
  RecordAcademic,
  RecordAchievement,
  RecordEducation,
  RecordLanguage,
  RecordProject,
  RecordSkill,
  RecordWork,
  Institution,
  Location,
  BugReport,
  Alert,
  Gatekeeper,
  Template,
  TemplateParam,
]
