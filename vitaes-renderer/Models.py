from datetime import datetime

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
