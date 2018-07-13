from datetime import date


class CvItem:
    def __init__(self):
        raise NotImplementedError()

    def __str__(self):
        raise NotImplementedError()


class CvLanguageItem(CvItem):
    def __init__(self, language: str, level: str = None):
        CvItem.__init__(self)
        self.language = language
        self.level = level

    def __str__(self):
        return """CvLanguage :{
    "language" : {language}
    "level" : {level}
}""".format(level=self.level, language=self.language)


class CvWorkExperienceItem(CvItem):
    def __init__(self, 
                 company: str,
                 location: str = None,
                 start_date: date = None,
                 finish_date: date = None,
                 description: str = None,
                 role: str = None
                 ):
        CvItem.__init__(self)
        self.company = company
        self.location = location
        self.start_date = start_date
        self.finish_date = finish_date
        self.description = description
        self.role = role

    def __str__(self):
        pass


class CvLocation:
    def __init__(self, country: str, state: str, city: str):
        self.country = country
        self.state = state
        self.city = city

    def __str__(self):
        pass


class CvProjectItem(CvItem):
    def __init__(self, name: str,
                 description: str,
                 start_date: date,
                 end_date: date,
                 language: str,
                 location: CvLocation
                 ):
        CvItem.__init__(self)
        self.name = name
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.language = language
        self.location = location

    def __str__(self):
        pass


class ImplementedProject:
    def __init__(self, projects: [CvProjectItem]):
        self.projects = projects

    def __str__(self):
        pass
