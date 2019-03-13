import { strings } from './i18n/strings';

// eslint-disable-next-line import/no-mutable-exports
export let fieldsDef = {};

export function updateFields() {
  fieldsDef = {
    achievementName: ['name', strings.achievementName, strings.title],
    achievementDescription: ['description', strings.achievementDescriptionPlaceholder, strings.description],
    articleLink: ['article_link', strings.articleLinkPlaceholder, strings.articleLink],
    certificateLink: ['certification_link', strings.certificateLinkPlaceholder, strings.certificateLink],
    city: ['city', strings.cityPlaceholder, strings.city],
    country: ['country', strings.countryPlaceholder, strings.country],
    course: ['course', strings.coursePlaceholder, strings.course],
    courseDescription: ['description', strings.courseDescriptionPlaceholder, strings.description],
    endDate: ['end_date', strings.endDatePlaceholder, strings.endDate],
    institution: ['institution', strings.institutionPlaceholder, strings.institution],
    jobDescription: ['description', strings.jobDescriptionPlaceholder, strings.description],
    language: ['language', strings.languagePlaceholder, strings.language],
    languageLevel: ['level', strings.languageLevelPlaceholder, strings.languageLevel],
    place: ['place', strings.placePlaceholder, strings.place],
    programLanguage: ['language', strings.programLanguagePlaceholder, strings.programLanguage],
    projectName: ['name', strings.projectNamePlaceholder, strings.title],
    projectDescription: ['description', strings.projectDescriptionPlaceholder, strings.description],
    repositoryLink: ['repository_link', strings.repositoryLinkPlaceholder, strings.repositoryLink],
    role: ['role', strings.rolePlaceholder, strings.role],
    skillName: ['skill_name', strings.skillPlaceholder, strings.skill],
    skillType: ['skill_type', strings.skillTypePlaceholder, strings.skillType],
    startDate: ['start_date', strings.startDatePlaceholder, strings.startDate],
    state: ['state', strings.statePlaceholder, strings.state],
    teacher: ['teacher', strings.teacherPlaceholder, strings.teacher],
  };
}

export default fieldsDef;
