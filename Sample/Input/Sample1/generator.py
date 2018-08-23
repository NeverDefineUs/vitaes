import Renders
import CurriculumVitae
import Models

def generate():
    cv = CurriculumVitae.CurriculumVitae()
    cv.add(Models.CvHeaderItem(name="Arthur Costa", address="Avenida Bernardo Vieira de Melo, 2087, Jaboatao dos guararapes, Brazil", github="github.com/Arthurlpgc", phone="+55 (81) 99429-3511", email="arthurlpgcosta@gmail.com"))

    recife = Models.CvLocation(country="Brazil", city="Recife")
    seattle = Models.CvLocation(country="USA", city="Seattle")
    london = Models.CvLocation(country="United Kingdom", city="London")
    saopaulo = Models.CvLocation(country="Brazil", city="Sao Paulo")

    ufpe = Models.CvInstitution("UFPE")
    unicamp = Models.CvInstitution("Unicamp")
    coursera_stanford = Models.CvInstitution("Coursera, Stanford")
    coursera_mines = Models.CvInstitution("Coursera, Mines-Telecom")
    inloco = Models.CvInstitution("Inloco")
    ms = Models.CvInstitution("Microsoft")
    facebook = Models.CvInstitution("Facebook")
    harvardx = Models.CvInstitution("Edx, Harvard")

    #BSC
    cv.add(Models.CvEducationalExperienceItem(course="Computer Science BSc", institution=ufpe, location=recife, start_date="2015-3-1", end_date="2019-7-1"))
    #Inloco
    cv.add(Models.CvWorkExperienceItem(role="Junior Researcher", institution=inloco, location=recife, start_date="2017-5-1", end_date="2017-9-1", description="Worked on the algorithms of wifi-based location and visit detection."))
    #Microsoft
    cv.add(Models.CvWorkExperienceItem(role="Software Engineer Intern", institution=ms, location=seattle, start_date="2017-12-11", end_date="2018-3-2", description="Worked on the windows accessibility tools."))
    #Facebook
    cv.add(Models.CvWorkExperienceItem(role="Software Engineer Intern", institution=facebook, location=london, start_date="2018-5-14", end_date="2018-8-3", description="Worked on the security of the internal network devices."))
    #Icpc
    cv.add(Models.CvAchievementProjectItem(name="3rd Place in ACM-ICPC Brazilian Regionals", competitors=816, start_date="2017-9-9", end_date="2017-9-9"))
    cv.add(Models.CvAchievementProjectItem(name="4th Place in ACM-ICPC South America Regionals", competitors=440, start_date="2017-11-11", end_date="2017-11-11"))
    cv.add(Models.CvAchievementProjectItem(name="104th Place in ACM-ICPC World Finals", competitors=140, start_date="2018-4-19", end_date="2018-4-19"))
    #ms3c
    cv.add(Models.CvAchievementProjectItem(name="2nd Place at Microsoft College Coding Competition at UFPE", competitors=54, start_date="2017-4-5", end_date="2017-4-5"))
    #raytracer
    cv.add(Models.CvImplementationProjectItem(name="Quadrics and Bezier surfaces Raytracer", language="C++", start_date="2016-11-1", end_date="2016-11-1"))
    #TA
    #cv.add(Models.CvImplementationProjectItem(name="Contributions on Teacher Assistant Project", language="Groovy", start_date="2016-9-1", end_date="2016-12-1"))
    #Music Sender and Player Java app(Client and Server)
    cv.add(Models.CvImplementationProjectItem(name="Music Sender and Player Java app(Client and Server)", language="Java", start_date="2016-5-1", end_date="2016-5-1"))
    #Codepit and Algo visualizer
    cv.add(Models.CvImplementationProjectItem(name="Contributions on Codepit and Jason Park Algorithm visualizer", language="Javascript", start_date="2016-6-1", end_date="2016-6-1"))
    #CVCS
    cv.add(Models.CvImplementationProjectItem(name="CVCS", language="Python", start_date="2018-7-13", description="Created an open source tool for creating resumes for computer science students, works by creating a abstract tree from a json with the fields, and then generates the CV using any of the renders avaliable. Github: https://github.com/Arthurlpgc/CVCS"))
    #Algorithms
    cv.add(Models.CvAcademicProjectItem(name="Algorithms Teacher Assistant", institution=ufpe, start_date="2016-3-1", end_date="2017-12-1", description="Gave lectures about Algorithms and Data Structures such as BFS, AVL trees to classrooms of over 50 students each semester"))
    #Languages
    cv.add(Models.CvLanguageItem(language="Portuguese", level="Native"))
    cv.add(Models.CvLanguageItem(language="English", level="Fluent"))
    #Courses
    cv.add(Models.CvEducationalExperienceItem(course="Unicamp ICPC Summer School", teacher="Maxim Akhmendov and Mike Mirzayanaov", institution=unicamp, location=saopaulo, start_date="2017-1-1", end_date="2017-1-1"))
    cv.add(Models.CvEducationalExperienceItem(course="Encryption I", teacher="Dan Boneh", institution=coursera_stanford, start_date="2017-1-14", end_date="2017-1-14"))
    cv.add(Models.CvEducationalExperienceItem(course="Machine Learning", teacher="Andrew Ng", institution=coursera_stanford, start_date="2016-12-20", end_date="2016-12-20"))
    cv.add(Models.CvEducationalExperienceItem(course="Getting started with Augmented Reality", institution=coursera_mines, start_date="2016-11-30", end_date="2016-11-30"))
    cv.add(Models.CvEducationalExperienceItem(course="Fundamentals of Neuroscience I", institution=harvardx, start_date="2014-9-24", end_date="2014-9-24"))

    print(Renders.CvRenderJsonRequest.render(cv))
