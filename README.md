# CVCS
CVCS is a project that creates an Abstract Tree of your CV so you can compile it in multiple formats automatically.
# How to set up
Run `pip3 install -r requirements.txt`(You need pip and python for it), then download and install the version that pdflatex that matches your operating system.
# How to use it
Ramon Saboya is about to tell you
# Types
The types are divided in two types of types, the Items, and the non-Items, and Item is something that will be added to your curriculum, as opposed to the Non-Items, that represent dependencies you curriculum has such as places and institutions.
## Non Items
Starting on the Non-Items since they dont have dependencies on Items:
### CvLocation
Represents a location.

Fields:
* country(_str_): Represents the country of the location
* state(_str_, Optional): Represents the state of the location
* city(_str_, Optional): Represents the city of the location
### CvInstitution
Represents a institution, such as a place you studied or worked on(Can represent online institutions as well).

Fields:
* name(_str_): States the name of it.
* location(_CvLocation_, Optional): Where the institution is located at.
## Items
### CvLanguageItem
Represents a language (not a programming language).

Fields:
* language(_str_): States the name of it.
* level(_str_, Optional): The level associated with the language (eg. Intermediate, Fluent, Native...).
### CvEducationalExperienceItem
Represents an experience in an education institution whether is presencial or online

Fields:
* institution(_CvInstitution_): What is the institution.
* start_date(_datetime_): When the experience started.
* location(_CvLocation_, Optional): Where the institution is located at.
* end_date(_datetime_, Optional): When the experience ended. ("present" if ommited)
* description(_str_, Optional): The description of the experience.
* teacher(_str_, Optional): Name of the teacher/orienter.

### CvWorkExperienceItem
### CvImplementationProjectItem
### CvAcademicProjectItem
### CvAchievementProjectItem
### CvHeaderItem