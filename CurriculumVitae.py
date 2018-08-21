from Models import *


class CurriculumVitae:
    def __init__(self):
        self.header = None

        self.items = {}
        self.item_types = []

    def __str__(self):
        x = "{ "
        for var in vars(self):
            var_att = getattr(self, var)
            if isinstance(var_att, list) and var_att != []:
                x += str(var) + ": [ "
                for item in var_att:
                    x += str(item) + ", "
                x += "], "
            elif var_att is not None and var_att != []:
                x += str(var) + ": " + str(var_att) + ", "
        x += "}"
        return x

    def add(self, item: CvItem):
        if type(item) is CvHeaderItem:
            self.header = item
            return

        if type(item) not in self.item_types:
            self.item_types.append(type(item))
            self.items[type(item)] = []

        self.items[type(item)].append(item)
        
