import CurriculumVitae, Models, datetime, time
import string, random, os
import subprocess, json
import timestring
from Cheetah.Template import Template

def date_comparer(x):
    end_date=x.end_date
    start_date=x.start_date
    if end_date == None:
        end_date = datetime.datetime(2100, 10, 10, 1, 1, 1)
    return (end_date, start_date)

def date_comparer_2(x):
    end_date = ""
    start_date = x['start_date']
    if 'end_date' in x:
        end_date = x['end_date']
    else:
        end_date = datetime.datetime(2100, 10, 10, 1, 1, 1)
    return (end_date, start_date)
    
class CvRenderBase:
    def render(cv: CurriculumVitae):
        raise NotImplementedError

class CvRenderTex(CvRenderBase):
    def render(cv: CurriculumVitae, params={}):
        texString = """\\documentclass[11pt,a4paper,sans]{moderncv} 
\\moderncvstyle{casual}
\\moderncvcolor{blue} 
\\usepackage{lipsum}
\\usepackage[scale=""" + params["scale"] + """]{geometry} 
"""
        if cv.header == None:
            return -1
        first_name = cv.header.name.split(' ')[0]
        family_name = ' '.join(cv.header.name.split(' ')[1:])
        texString += "\\firstname{" + first_name + "}\n"
        texString += "\\familyname{" + family_name + "}\n"
        texString += "\\title{Curriculum Vitae}\n"
        if cv.header.address != None:
            texString += "\\address{" + cv.header.address + "}{}\n"
        if cv.header.phone != None:
            texString += "\\phone{" + cv.header.phone + "}\n"
        if cv.header.email != None:
            texString += "\\email{" + cv.header.email + "}\n"
        if cv.header.homepage != None:
            texString += "\\homepage{" + cv.header.homepage + "}{" + cv.header.homepage + "} \n"
        elif cv.header.github != None:
            texString += "\\homepage{" + cv.header.github + "}{" + cv.header.github + "} \n"
        elif cv.header.linkedin != None:
            texString += "\\homepage{" + cv.header.linkedin + "}{" + cv.header.linkedin + "} \n"
        texString += "\\begin{document}\n\\makecvtitle\n"
        if Models.CvEducationalExperienceItem in cv.items:
            texString += "\\section{Education}\n"
            educationalExperience = cv.items[Models.CvEducationalExperienceItem]
            educationalExperience.sort(key = date_comparer, reverse = True)
            for elem in educationalExperience:
                texString += "\\cventry{" + elem.start_date.strftime("%b/%y") + " "
                if elem.end_date == None:
                    texString += "Present"
                elif elem.start_date.strftime("%b/%y") != elem.end_date.strftime("%b/%y"):
                    texString += elem.end_date.strftime("%b/%y")
                texString += "}{" + elem.course + "}{" + elem.institution.name + "}{"
                if elem.location != None:
                    texString += str(elem.location)
                texString += "}{}{"
                if elem.description != None:
                    texString += elem.description
                texString += "}\n"
        if Models.CvWorkExperienceItem in cv.items:
            texString += "\\section{Work Experience}\n"
            workExperience = cv.items[Models.CvWorkExperienceItem]
            workExperience.sort(key = date_comparer, reverse = True)
            for elem in workExperience:
                texString += "\\cventry{" + elem.start_date.strftime("%b/%y") + " "
                if elem.end_date == None:
                    texString += "Present"
                else:
                    texString += elem.end_date.strftime("%b/%y")
                if elem.role is None:
                    texString += "}{" + elem.institution.name + "}{}{"
                else:
                    texString += "}{" + elem.role + "}{" + elem.institution.name + "}{"
                if elem.location != None:
                    texString += str(elem.location)
                texString += "}{}{"
                if elem.description != None:
                    texString += elem.description
                texString += "}\n"
        if Models.CvAchievementItem in cv.items:
            texString += "\\section{Achievements}\n"
            achievements = cv.items[Models.CvAchievementItem]
            achievements.sort(key = date_comparer, reverse = True)
            for elem in achievements:
                texString += "\\cvitem{" + elem.start_date.strftime("%d/%b/%Y") + "}{" + elem.name
                if elem.competitors > 0:
                    texString += "(Out of " + str(elem.competitors) + ")"
                texString += "}\n"
        if Models.CvImplementationProjectItem in cv.items:
            texString += "\\section{Projects}\n"
            projects = cv.items[Models.CvImplementationProjectItem]
            projects.sort(key = date_comparer, reverse = True)
            for elem in projects:
                start_date = elem.start_date.strftime("%b/%Y")
                texString += "\\cventry{" + start_date
                if elem.end_date != None:
                    end_date = elem.end_date.strftime("%b/%Y")
                    if end_date != start_date:
                        texString += " " + end_date
                else:
                    texString += " Present"
                texString += "}{" + elem.name + "}{" 
                if elem.language != None:
                    texString += elem.language
                texString += "}{}{}{"
                if elem.description != None:
                    texString += elem.description
                texString += "}\n"
        if Models.CvAcademicProjectItem in cv.items:
            texString += "\\section{Academic Experience}\n"
            projects = cv.items[Models.CvAcademicProjectItem]
            projects.sort(key = date_comparer, reverse = True)
            for elem in projects:
                start_date = elem.start_date.strftime("%b/%Y")
                texString += "\\cventry{" + start_date
                if elem.end_date != None:
                    end_date = elem.end_date.strftime("%b/%Y")
                    if end_date != start_date:
                        texString += " " + end_date
                else:
                    texString += " Present"
                texString += "}{" + elem.name + "}{" 
                if elem.institution != None:
                    texString += elem.institution.name
                texString += "}{}{}{"
                if elem.description != None:
                    texString += elem.description
                texString += "}\n"
        if Models.CvLanguageItem in cv.items:
            texString += "\\section{Languages}\n"
            languages = cv.items[Models.CvLanguageItem]
            for language in languages:
                texString += "\\cvitem{" + language.language + "}{" + language.level + "}\n"
        texString += "\\end{document}\n"
        return texString

class CvRenderTexToPdf(CvRenderBase):    
    def id_gen(size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))
    
    def render(cv: CurriculumVitae, cvRender: CvRenderBase=CvRenderTex, baseFolder: str="cv_7", path: str=None, command: str="pdflatex", params={}):
        if path == None:
            path=CvRenderTexToPdf.id_gen()
        os.system("mkdir Output/" + path)
        if baseFolder != None:
            os.system("cp -r Templates/" + baseFolder + "/* Output/" + path + "/")
        os.system("touch Output/" + path + "/main.tex")
        cv = cvRender.render(cv, params=params)
        file = open("Output/" + path + "/main.tex","w", encoding="utf-8") 
        file.write(cv)
        file.close()
        p = subprocess.Popen([command,"main.tex"], cwd="Output/" + path)
        p.wait()
        os.system("cp Output/" + path + "/main.pdf Output/" + path + ".pdf")
        os.system("rm -r Output/" + path + "/")
        return path

class CvRenderJsonRequest(CvRenderBase):
    def extract_item(x):
        dic = {}
        for varname in vars(x):
            var = eval('x.' + varname)
            if var is None or varname == "item_type":
                continue
            elif var.__class__.__name__[0:2] == "Cv":
                var = {var.__class__.__name__: CvRenderJsonRequest.extract_item(var)}
            elif var.__class__.__name__ == "date":
                var = var.strftime("%y-%m-%d")
            dic[varname] = var
        return dic
    def extract_list(raw_arr):
        arr = []
        for elem in raw_arr:
            arr.append(CvRenderJsonRequest.extract_item(elem))
        return arr
    def cv_to_dict(cv):
        dic = {}
        dic['CvHeaderItem'] = CvRenderJsonRequest.extract_item(cv.header)
        for item in cv.items:
            dic[item.__name__] = CvRenderJsonRequest.extract_list(cv.items[item])
        return dic
    def render(cv: CurriculumVitae):
        return json.dumps(CvRenderJsonRequest.cv_to_dict(cv), indent=4)

class CvRenderCheetahTemplate(CvRenderBase):
    def add_dates(itemDict, key, baseDate: datetime):
        baseDate = timestring.Date(baseDate).date
        itemDict[key] = baseDate
        return itemDict
    def extract_item(cv: CurriculumVitae, key):
        ret = []
        if key in cv.items:
            for item in cv.items[key]:
                itemDict = {}
                for var in vars(item):
                    if eval("item." + var) == None:
                        continue
                    if var == "item_type":
                        continue
                    if var == "location":
                        itemDict["country"] = eval("item." + var).country
                        itemDict["city"] = eval("item." + var).city
                        itemDict["state"] = eval("item." + var).state
                    elif var == "institution": 
                        itemDict[var] = item.institution.name
                    elif var[-4:] == "date":
                        itemDict = CvRenderCheetahTemplate.add_dates(itemDict, var, eval("item." + var))
                    else:
                        itemDict[var] = eval("item." + var)
                ret.append(itemDict)
        if ret != [] and 'start_date' in ret[0]:
            ret.sort(key = date_comparer_2, reverse = True)
        return ret
    def extract_skills(cv):
        skills = {}
        if Models.CvLanguageItem in cv.items and cv.items[Models.CvLanguageItem] != []:
            skills["languages"] = []
            for language in cv.items[Models.CvLanguageItem]:
                skills["languages"].append(language)
        if Models.CvSkillItem in cv.items and cv.items[Models.CvSkillItem] != []:
            for skill in cv.items[Models.CvSkillItem]:
                if str(skill.skill_type) not in skills:
                    skills[str(skill.skill_type)] = []
                skills[str(skill.skill_type)].append(language)
        return skills
    def render(cv: CurriculumVitae, baseFolder: str="awesome", params={}):
        file = open("Templates/" + baseFolder + "/main.tex", "r", encoding="utf-8")
        templateString = file.read()
        file.close()
        cvDict = {}
        headerVars = ["name", "address", "github", "linkedin", "email", "phone", "birthday", "homepage"]
        cvDict["firstname"] = cv.header.name.split(' ')[0]
        cvDict["surname"] = ' '.join(cv.header.name.split(' ')[1:])
        cvDict["lastname"] = cv.header.name.split(' ')[-1]
        for var in headerVars:
            cvDict[var] = eval("cv.header." + var)
        if cv.header.birthday != None:
            cvDict["birthday"] = cv.header.birthday.strftime("%B %d, %Y")
        cvDict["work_array"] = CvRenderCheetahTemplate.extract_item(cv, Models.CvWorkExperienceItem)
        cvDict["education_array"] = CvRenderCheetahTemplate.extract_item(cv, Models.CvEducationalExperienceItem)
        cvDict["academic_array"] = CvRenderCheetahTemplate.extract_item(cv, Models.CvAcademicProjectItem)
        cvDict["language_array"] = CvRenderCheetahTemplate.extract_item(cv, Models.CvLanguageItem)
        cvDict["project_array"] = CvRenderCheetahTemplate.extract_item(cv, Models.CvImplementationProjectItem)
        cvDict["achievement_array"] = CvRenderCheetahTemplate.extract_item(cv, Models.CvAchievementItem)
        cvDict["skill_array"] = CvRenderCheetahTemplate.extract_skills(cv)
        cvDict["params"] = params
        template = Template(templateString, cvDict)
        return str(template)




        