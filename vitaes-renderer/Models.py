from datetime import datetime

class CvExperienceItem(CvItem):
    def __init__(self,
                 institution: CvInstitution,
                 start_date: datetime,
                 location: CvLocation = None,
                 end_date: datetime = None,
                 description: str = None):
        CvItem.__init__(self)
        self.institution = institution
        self.location = location
        self.start_date = start_date
        self.end_date = end_date
        self.description = description


class CvWorkExperienceItem(CvExperienceItem):
    def __init__(self, 
                 institution: CvInstitution,
                 start_date: datetime,
                 location: CvLocation = None,
                 end_date: datetime = None,
                 description: str = None,
                 role: str = None,
                 ):
        CvExperienceItem.__init__(self, institution=institution, location=location, start_date=start_date, end_date=end_date, description=description)
        self.role = role


class CvEducationalExperienceItem(CvExperienceItem):
    def __init__(self,
                 institution: CvInstitution,
                 start_date: datetime,
                 course: str,
                 location: CvLocation = None,
                 end_date: datetime = None,
                 description: str = None,
                 teacher: str = None,
                 ):       
        CvExperienceItem.__init__(self, institution=institution, location=location, start_date=start_date, end_date=end_date, description=description)
        self.course = course


class CvProjectItem(CvItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 location: CvLocation = None,
                 start_date: datetime = None,
                 end_date: datetime = None
                 ):
        CvItem.__init__(self)
        self.name = name
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.location = location


class CvImplementationProjectItem(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 location: CvLocation = None,
                 language: str = None,
                 repository_link: str = None,
                 start_date: datetime = None,
                 end_date: datetime = None
                 ):
        CvProjectItem.__init__(self, name=name, description=description, location=location, start_date=start_date, end_date=end_date)
        self.language = language
        self.repository_link = repository_link


class CvAcademicProjectItem(CvProjectItem):
    def __init__(self,
                 name: str,
                 description: str = None,
                 institution: CvInstitution = None,
                 location: CvLocation = None,
                 article_link: str = None,
                 start_date: datetime = None,
                 end_date: datetime = None
                 ):
        CvProjectItem.__init__(self, name=name, description=description, location=location, start_date=start_date, end_date=end_date)
        self.article_link = article_link
        self.institution = institution


class CvAchievementItem(CvItem):
    def __init__(self,
                 name: str,
                 start_date: datetime,
                 description: str = None,
                 institution: CvInstitution = None,
                 location: CvLocation = None,
                 place: str = '',
                 competitors: int = 0,
                 end_date: datetime = None,
                 certification_link: str = None
                 ):
        CvItem.__init__(self)
        self.name = name
        self.start_date = start_date
        self.description = description
        self.institution = institution
        self.location = location
        self.place = place
        self.competitors = int(competitors)
        self.end_date = end_date
        self.certification_link = certification_link


class CvHeaderItem(CvItem):
    def __init__(self,
                 name: str,
                 email: str = None,
                 phone: str = None,
                 linkedin: str = None,
                 github: str = None,
                 address: str = None,
                 birthday: datetime = None,
                 homepage: str = None
                 ):
        CvItem.__init__(self)
        assert(name is not None)
        self.name = name
        self.email = email
        self.phone = phone
        self.linkedin = linkedin
        self.github = github
        self.address = address
        self.birthday = birthday
        self.homepage = homepage
