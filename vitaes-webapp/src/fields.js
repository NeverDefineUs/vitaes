import { strings } from './i18n/localization';

export const fieldsDef = {
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
  projectName: ['name', 'Project name', strings.title],
  projectDescription: ['description', 'Short description of the project(* for items)', strings.description],
  repositoryLink: ['repository_link', 'Full URL to the repository'],
  role: ['role', 'Position held (e.g. Software Engineer)'],
  skillName: ['skill_name', 'Skill name'],
  skillType: ['skill_type', 'Description of the skill', strings.skillType],
  startDate: ['start_date', 'Starting date'],
  state: ['state', 'State name'],
  teacher: ['teacher', "Teacher's name"],
};

export default fieldsDef;
