import CurriculumVitae, Models, datetime

class CvRenderBase:
    def render(cv: CurriculumVitae):
        raise NotImplementedError
class CvRenderTex(CvRenderBase):
    def render(cv: CurriculumVitae):
        texString = """\\documentclass[11pt,a4paper,sans]{moderncv} 
\\moderncvstyle{casual}
\\moderncvcolor{blue} 
\\usepackage{lipsum}
\\usepackage[scale=0.75]{geometry} 
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
            #TODO: order by start date/ end date
            for elem in cv.items[Models.CvEducationalExperienceItem]:
                texString += "\\cventry{2011--2012}{" + elem.course + "}{" + elem.institution.name + "}{}{\\textit{GPA -- 8.0}}{First Class Honours}\n"

        return texString





        