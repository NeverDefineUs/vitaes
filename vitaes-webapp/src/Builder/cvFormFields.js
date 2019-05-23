import { translate } from 'i18n/locale';

import { fieldsDef, updateFields } from './shared/fields';

// eslint-disable-next-line import/no-mutable-exports
export let cvFormFields = [];

export function updateFormFields() {
  updateFields();
  cvFormFields = [
    {
      label: translate('work'),
      cvkey: 'work',
      fields: [
        fieldsDef.institution,
        fieldsDef.role,
        fieldsDef.startDate,
      ],
      optFields: [
        fieldsDef.endDate,
        fieldsDef.country,
        fieldsDef.state,
        fieldsDef.city,
        fieldsDef.jobDescription,
      ],
    },
    {
      label: translate('education'),
      cvkey: 'education',
      fields: [
        fieldsDef.institution,
        fieldsDef.course,
        fieldsDef.startDate,
      ],
      optFields: [
        fieldsDef.endDate,
        fieldsDef.country,
        fieldsDef.state,
        fieldsDef.city,
        fieldsDef.teacher,
        fieldsDef.courseDescription,
      ],
    },
    {
      label: translate('academic'),
      cvkey: 'academic',
      fields: [fieldsDef.projectName, fieldsDef.startDate],
      optFields: [
        fieldsDef.endDate,
        fieldsDef.institution,
        fieldsDef.country,
        fieldsDef.state,
        fieldsDef.city,
        fieldsDef.articleLink,
        fieldsDef.projectDescription,
      ],
    },
    {
      label: translate('achievements'),
      cvkey: 'achievement',
      fields: [
        fieldsDef.achievementName,
        fieldsDef.startDate,
      ],
      optFields: [
        fieldsDef.endDate,
        fieldsDef.institution,
        fieldsDef.country,
        fieldsDef.state,
        fieldsDef.city,
        fieldsDef.place,
        fieldsDef.certificateLink,
        fieldsDef.achievementDescription,
      ],
    },
    {
      label: translate('projects'),
      cvkey: 'project',
      fields: [fieldsDef.projectName, fieldsDef.startDate],
      optFields: [
        fieldsDef.endDate,
        fieldsDef.programLanguage,
        fieldsDef.country,
        fieldsDef.state,
        fieldsDef.city,
        fieldsDef.repositoryLink,
        fieldsDef.projectDescription,
      ],
    },
    {
      label: translate('languages'),
      cvkey: 'language',
      fields: [
        fieldsDef.language,
        fieldsDef.languageLevel,
      ],
      optFields: [],
    },
    {
      label: translate('skills'),
      cvkey: 'skill',
      fields: [
        fieldsDef.skillName,
        fieldsDef.skillType,
      ],
      optFields: [
        fieldsDef.skillLevel,
      ],
    },
  ];
}
