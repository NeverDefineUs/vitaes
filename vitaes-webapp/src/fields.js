import { strings } from './i18n/localization';

export const fieldsDef = {
  achievementName: ['name', strings.achievementName, strings.title],
  achievementDescription: ['description', strings.achievementDescriptionPlaceholder, strings.description],
  articleLink: ['article_link', strings.articleLinkPlaceholder, strings.articleLink],
  certificateLink: ['certification_link', 'Full URL to the certification'],
  city: ['city', 'City name'],
  country: ['country', 'Country name'],
  course: ['course', 'Name of the course (e.g. Computer Science Bachelor)'],
  courseDescription: ['description', 'Write details about the course(* for items)', strings.description],
  endDate: ['end_date', 'Ending date (leave empty for "present")'],
  institution: ['institution', 'Name of the institution (e.g. MIT)'],
  jobDescription: [
    'description',
    'Write activities performed at the job(* for items)',
    strings.description,
  ],
  language: ['language', 'Language name (e.g. English)'],
  languageLevel: ['level', 'Level of knowledge (e.g. Advanced)'],
  place: ['place', 'Rank obtained (e.g. 1th)'],
  programLanguage: ['language', 'Programming language used (e.g. Python)'],
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
