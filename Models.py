import datetime


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


class CvWorkExperience(CvItem):
    def __init__(self, 
                 company: str,
                 location: str = None,
                 start_date: datetime = None,
                 finish_date: datetime = None,
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


