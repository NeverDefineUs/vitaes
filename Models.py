from datetime import date


class CvItem:
    def __init__(self):
        pass

    def __str__(self):
        raise NotImplementedError()


class CvLanguageItem(CvItem):
    def __init__(self, language: str, level: str = None):
        CvItem.__init__(self)
        self.language = language
        self.level = level

    def __str__(self):
        return "{class_name} :{{ {language}: {level} }}".format(
            level=self.level, 
            language=self.language,
            class_name=self.__class__.__name__
        )


class CvLocationItem(CvItem):
    def __init__(self, country: str, state: str, city: str):
        CvItem.__init__(self)
        self.country = country
        self.state = state
        self.city = city

    def __str__(self):
        pass


class CvInstitutionItem(CvItem):
    def __init__(self, name: str, location: CvLocationItem):
        CvItem.__init__(self)
        self.name = name
        self.location = location

    def __str__(self):
        pass


class CvExperienceItem(CvItem):
    def __init__(self,
                 institution: CvInstitutionItem,
                 location: CvLocationItem,
                 start_date: date,
                 finish_date: date,
                 description: str):
        CvItem.__init__(self)
        self.institution = institution
        self.location = location
        self.start_date = start_date
        self.finish_date = finish_date
        self.description = description

    def __str__(self):
        pass


class CvWorkExperience(CvExperienceItem):
    def __init__(self, 
                 institution: CvInstitutionItem,
                 location: CvLocationItem,
                 start_date: date = None,
                 finish_date: date = None,
                 description: str = None,
                 role: str = None
                 ):
        CvExperienceItem.__init__(self, institution, location, start_date, finish_date, description)
        self.role = role

    def __str__(self):
        pass


class CvEducationalExperience(CvExperienceItem):
    def __init__(self,
                 institution: CvInstitutionItem,
                 location: CvLocationItem,
                 start_date: date,
                 finish_date: date,
                 description: str,
                 course: str):
        CvExperienceItem.__init__(self, institution, location, start_date, finish_date, description)
        self.course = course

    def __str__(self):
        pass


class CvProjectItem(CvItem):
    def __init__(self,
                 name: str,
                 description: str,
                 location: CvLocationItem,
                 start_date: date,
                 end_date: date = None
                 ):
        CvItem.__init__(self)
        self.name = name
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.location = location

    def __str__(self):
        pass


class CvImplementationProject(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str,
                 location: CvLocationItem,
                 language: str,
                 repository_link: str,
                 start_date: date,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.language = language
        self.repository_link = repository_link

    def __str__(self):
        pass


class CvAcademicProject(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str,
                 location: CvLocationItem,
                 article_link: str,
                 start_date: date,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.article_link = article_link

    def __str__(self):
        pass


class CvCourseProject(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str,
                 location: CvLocationItem,
                 certification_link: str,
                 course_link: str,
                 start_date: date,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.certification_link = certification_link
        self.course_link = course_link

    def __str__(self):
        pass


class CvAchievementProject(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str,
                 location: CvLocationItem,
                 place: str,
                 competitors: int,
                 start_date: date,
                 end_date: date = None,
                 certification_link: str = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.place = place
        self.competitors = competitors
        self.certification_link = certification_link

    def __str__(self):
        pass


class CvHeader(CvItem):
    def __init__(self,
                 email: str,
                 phone: str,
                 linkedin: str,
                 github: str):
        CvItem.__init__(self)
        self.email = email
        self.phone = phone
        self.linkedin = linkedin
        self.github = github

    def __str__(self):
        pass
