class CvItem:
    def __init__(self):
        raise NotImplementedError()
    def __str__(self):
        raise NotImplementedError()

class CvLanguage:
    def __init__(self, languageName: str):
        self.languageName = languageName
    
class CvLanguageLevel:
    def __init__(self, levelName):
        self.levelName = levelName

class CvLanguageItem(CvItem):
    def __init__(self, language: Language, level: LanguageLevel):
        self.language = language
        self.level = level

    def __str__(self):
        return """CvLanguage :{
    "language" : {language}
    "level" : {level}
}""".format(level=self.level, language=self.language)

