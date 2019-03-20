import { translate } from 'i18n/locale';

import { fieldsDef, updateFields } from './shared/fields';

// eslint-disble-next-line import/no-mutable-exports
export let cvFormFields = [];

export function updateFormFields() {
  updateFields();
  cvFormFields = [
    {
      label: translate('work'),
      cvkey: 'CvWorkExperienceItem',
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
      cvkey: 'CvEducationalExperienceItem',
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
      cvkey: 'CvAcademicProjectItem',
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
      cvkey: 'CvAchievementItem',
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
      cvkey: 'CvImplementationProjectItem',
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
      cvkey: 'CvLanguageItem',
      fields: [
        fieldsDef.language,
        fieldsDef.languageLevel,
      ],
      optFields: [],
    },
    {
      label: translate('skills'),
      cvkey: 'CvSkillItem',
      fields: [
        fieldsDef.skillName,
        fieldsDef.skillType,
      ],
      optFields: [],
    },
  ];
}
