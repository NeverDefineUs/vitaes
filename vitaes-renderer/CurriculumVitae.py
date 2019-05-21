from Models import *


class CurriculumVitae:
    def __init__(self, cv_hash):
        self.header = None
        self.cv_hash = cv_hash

        self.items = {}
        self.item_types = []

    def add(self, item, key):
        if key == 'CvHeaderItem':
            self.header = item
            return

        if key not in self.item_types:
            self.item_types.append(key)
            self.items[key] = []

        self.items[key].append(item)
