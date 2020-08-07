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
    name: 'Gatekeeper',
    definition(t) {
      t.model.vid()
      t.model.name()
      t.model.description()
    },
  }),
]
