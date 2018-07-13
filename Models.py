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


class CvLocation:
    def __init__(self, country: str, state: str = None, city: str = None):
        self.country = country
        self.state = state
        self.city = city

    def __str__(self):
        pass


class CvInstitution:
    def __init__(self, name: str, location: CvLocation = None):
        self.name = name
        self.location = location

    def __str__(self):
        pass


class CvExperienceItem(CvItem):
    def __init__(self,
                 institution: CvInstitution,
                 location: CvLocation = None,
                 start_date: date,
                 finish_date: date = None,
                 description: str = None):
        CvItem.__init__(self)
        self.institution = institution
        self.location = location
        self.start_date = start_date
        self.finish_date = finish_date
        self.description = description

    def __str__(self):
        pass


class CvWorkExperienceItem(CvExperienceItem):
    def __init__(self, 
                 institution: CvInstitution,
                 location: CvLocation = None,
                 start_date: date = None,
                 finish_date: date = None,
                 description: str = None,
                 role: str = None
                 ):
        CvExperienceItem.__init__(self, institution, location, start_date, finish_date, description)
        self.role = role

    def __str__(self):
        pass


class CvEducationalExperienceItem(CvExperienceItem):
    def __init__(self,
                 institution: CvInstitution,
                 location: CvLocation = None,
                 start_date: date,
                 finish_date: date = None,
                 description: str = None,
                 course: str):
        CvExperienceItem.__init__(self, institution, location, start_date, finish_date, description)
        self.course = course

    def __str__(self):
        pass


class CvProjectItem(CvItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 location: CvLocation = None,
                 start_date: date = None,
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


class CvImplementationProjectItem(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 location: CvLocation = None,
                 language: str = None,
                 repository_link: str = None,
                 start_date: date = None,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.language = language
        self.repository_link = repository_link

    def __str__(self):
        pass


class CvAcademicProjectItem(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str,
                 institution: CvInstitution = None,
                 location: CvLocation = None,
                 article_link: str = None,
                 start_date: date = None,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.article_link = article_link
        self.institution = institution

    def __str__(self):
        pass


class CvCourseProjectItem(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 location: CvLocation = None,
                 institution: CvInstitution = None,
                 certification_link: str = None,
                 course_link: str = None,
                 start_date: date,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.certification_link = certification_link
        self.course_link = course_link

    def __str__(self):
        pass


class CvAchievementProjectItem(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 institution: CvInstitution = None,
                 location: CvLocation = None,
                 place: str = '',
                 competitors: int = 0,
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


class CvHeaderItem(CvItem):
    def __init__(self,
                 name: str,
                 email: str = None,
                 phone: str = None,
                 linkedin: str = None,
                 github: str = None,
                 address: str = None):
        CvItem.__init__(self)
        self.name = name
        self.email = email
        self.phone = phone
        self.linkedin = linkedin
        self.github = github
        self.address = address

    def __str__(self):
        pass
