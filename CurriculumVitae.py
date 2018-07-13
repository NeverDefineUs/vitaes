from Models import *


class CurriculumVitae:
    def __init__(self):
        self.work_experience = []
        self.languages = []

    def add(self, item: CvItem):
        if type(item) is CvWorkExperienceItem:
            self.work_experience.append(item)
        elif type(item) is CvLanguageItem:
            self.languages.append(item)
