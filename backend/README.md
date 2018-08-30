# CVCS
CVCS is a project that creates an Abstract Tree of your CV so you can compile it in multiple formats automatically.
# How to set up
Install docker and run `docker build . -t cvcs` and `docker run -i -t -p 5000:5000 cvcs`
# How to use it
While running the docker run `curl -d @Sample/Input/Sample1/data.json -H "Content-Type:application/json" -X POST http://localhost:5000/CV/ > Sample.pdf` 
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
* teacher(_str_, Optional): States the name of the teacher/orienter.

### CvWorkExperienceItem
Represents an experience in an working in an institution whether is internship or full-time

Fields:
* institution(_CvInstitution_): What is the institution.
* start_date(_datetime_): When the experience started.
* location(_CvLocation_, Optional): Where the institution is located at.
* end_date(_datetime_, Optional): When the experience ended. ("present" if ommited)
* description(_str_, Optional): The description of the experience.
* role(_str_, Optional): States the role held.

### CvImplementationProjectItem
Represents an implementation project.

Fields:
* name(_str_): States the name of the project.
* description(_str_, Optional): States the description of the project.
* location(_CvLocation_, Optional): Where the project was developed.
* language(_str_, Optional): States the core programming language used in the project.
* repository_link(_str_, Optional): States the url to access the repository.
* start_date(_datetime_, Optional): When the project started.
* end_date(_datetime_, Optional): When the project ended.

### CvAcademicProjectItem
Represents an academic project (eg. Teaching Assistant, Scientific Research...)

Fields:
* name(_str_): States the name of the project.
* description(_str_, Optional): States the description of the project.
* institution(_CvInstitution_, Optional): What is the institution where the project was developed.
* location(_CvLocation_, Optional): Where the project was developed.
* article_link(_str_, Optional): States the url to access the article.
* start_date(_datetime_, Optional): When the project started.
* end_date(_datetime_, Optional): When the project ended.

### CvAchievementItem
Represents an achievement earned by you or a project of yours.

Fields:
* name(_str_): States the name of the achievement.
* start_date(_datetime_, Optional): When the competition that earned the achievement started.
* description(_str_, Optional): States the description of the achievement.
* institution(_CvInstitution_, Optional): States the host institution of the event.
* location(_CvLocation_, Optional): Where the competition happened.
* place(_str_, Optional): States the position achieved.
* competitors(_int_, Optional): States the amount of competitors.
* end_date(_datetime_, Optional): When the competition that earned the achievement ended.
* certification_link(_str_, Optional): States the url to access the certification.

### CvHeaderItem
Represents the header that holds information about you.

Fields:
* name(_str_): States the name.
* email(_str_, Optional): States the email.
* phone(_str_, Optional): States the phone number.
* linkedin(_str_, Optional): States the linkedin url.
* github(_str_, Optional): States the github url.
* address(_str_, Optional): States the address (short form).
* birthday(_datetime_, Optional): States the birthday.
* homepage(_str_, Optional): States the homepage.
