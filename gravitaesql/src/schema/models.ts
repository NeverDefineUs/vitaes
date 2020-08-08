import { objectType } from '@nexus/schema'

export default [
  objectType({
    name: 'User',
    definition(t) {
      t.model.vid()
      t.model.firebaseId()
      t.model.autosave()

      t.model.recordOwner()

      t.model.gatekeepers()
      t.model.recordSets()
    },
  }),
  objectType({
    name: 'RecordSet',
    definition(t) {
      t.model.vid()
      t.model.title()

      t.model.recordOwner()

      t.model.owner()
    },
  }),
  objectType({
    name: 'RecordOwner',
    definition(t) {
      t.model.vid()
      t.model.sectionOrder()
    },
  }),
  objectType({
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

      t.model.recordOwner()
    },
  }),
  objectType({
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

      t.model.recordOwner()
    },
  }),
  objectType({
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

      t.model.recordOwner()
    },
  }),
  objectType({
    name: 'RecordLanguage',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.level()

      t.model.recordOwner()
    },
  }),
  objectType({
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

      t.model.recordOwner()
    },
  }),
  objectType({
    name: 'RecordSkill',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.type()
      t.model.level()

      t.model.recordOwner()
    },
  }),
  objectType({
    name: 'RecordWork',
    definition(t) {
      t.model.vid()
      t.model.role()
      t.model.startDate()
      t.model.endDate()
      t.model.description()

      t.model.location()
      t.model.institution()

      t.model.recordOwner()
    },
  }),
  objectType({
    name: 'Institution',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.abbreviaton()
    },
  }),
  objectType({
    name: 'Location',
    definition(t) {
      t.model.vid()
      t.model.country()
      t.model.governingDistrict()
      t.model.cityTown()
    },
  }),
  objectType({
    name: 'Alert',
    definition(t) {
      t.model.vid()
      t.model.message()
      t.model.type()

      t.model.author()
    },
  }),
  objectType({
    name: 'BugReport',
    definition(t) {
      t.model.vid()
      t.model.title()
      t.model.email()
      t.model.description()
      t.model.data()

      t.model.author()
    },
  }),
  objectType({
    name: 'Gatekeeper',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.description()
    },
  }),
  objectType({
    name: 'Template',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.baseFolder()
      t.model.command()

      t.model.params()
    },
  }),
  objectType({
    name: 'TemplateParam',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.displayName()
      t.model.defaultValue()
      t.model.values()

      t.model.template()
    },
  }),
]
