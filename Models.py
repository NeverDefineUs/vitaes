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
    def __init__(self,
                 name: str,
                 description: str,
                 location: CvLocation,
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
                 location: CvLocation,
                 language: str,
                 start_date: date,
                 end_date: date = None
                 ):
        CvProjectItem.__init__(self, name, description, location, start_date, end_date)
        self.language = language

    def __str__(self):
        pass
