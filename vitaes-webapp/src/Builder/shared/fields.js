import { translate } from 'i18n/locale';


// eslint-disable-next-line import/no-mutable-exports
export let fieldsDef = {};

export function updateFields() {
  fieldsDef = {
    achievementName: ['name', translate('achievement_name'), translate('title')],
    achievementDescription: ['description', translate('achievement_description_placeholder'), translate('description')],
    articleLink: ['article_link', translate('article_link_placeholder'), translate('article_link')],
    certificateLink: ['certification_link', translate('certificate_link_placeholder'), translate('certificate_link')],
    city: ['city', translate('city_placeholder'), translate('city')],
    country: ['country', translate('country_placeholder'), translate('country')],
    course: ['course', translate('course_placeholder'), translate('course')],
    courseDescription: ['description', translate('course_description_placeholder'), translate('description')],
    endDate: ['end_date', translate('date_format') + translate('end_date_placeholder'), translate('end_date')],
    institution: ['institution', translate('institution_placeholder'), translate('institution')],
    jobDescription: ['description', translate('job_description_placeholder'), translate('description')],
    language: ['language', translate('language_placeholder'), translate('language')],
    languageLevel: ['level', translate('language_level_placeholder'), translate('language_level')],
    place: ['place', translate('place_placeholder'), translate('place')],
    programLanguage: ['language', translate('program_language_placeholder'), translate('program_language')],
    projectName: ['name', translate('project_name_placeholder'), translate('title')],
    projectDescription: ['description', translate('project_description_placeholder'), translate('description')],
    repositoryLink: ['repository_link', translate('repository_link_placeholder'), translate('repository_link')],
    role: ['role', translate('role_placeholder'), translate('role')],
    skillName: ['skill_name', translate('skill_placeholder'), translate('skill')],
    skillType: ['skill_type', translate('skill_type_placeholder'), translate('skill_type')],
    startDate: ['start_date', translate('date_format'), translate('start_date')],
    state: ['state', translate('state_placeholder'), translate('state')],
    teacher: ['teacher', translate('teacher_placeholder'), translate('teacher')],
  };
}

updateFields();
export default fieldsDef;
