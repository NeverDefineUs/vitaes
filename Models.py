import datetime

class cv_item:
    def __init__(self):
        raise NotImplementedError()
    def __str__(self):
        raise NotImplementedError()

class cv_language_item(cv_item):
    def __init__(self, language: str, level: str = None):
        self.language = language
        self.level = level

    def __str__(self):
        return "{class_name} :{{ {language}: {level} }}".format(
            level=self.level, 
            language=self.language,
            class_name=self.__class__.__name__
        )

class cv_work_experience_item(cv_item):
    def __init__(self, 
        company: str, 
        location: str = None,
        start_date: datetime = None, 
        finish_date: datetime = None, 
        description:str = None, 
        role: str = None
    ):
        self.company = company
        self.location = location
        self.start_date = start_date
        self.finish_date = finish_date
        self.description = description
        self.role = role


