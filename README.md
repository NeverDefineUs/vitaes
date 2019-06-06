# Vitaes ![circleci_status]

| Api                           | Stolas                           | logger                           | renderer                           | storage                           | webapp                           |
| ----------------------------- | -------------------------------- | -------------------------------- | ---------------------------------- | --------------------------------- | -------------------------------- |
| ![status_api_security]        | ![status_stolas_security]        | ![status_logger_security]        | ![status_renderer_security]        | ![status_storage_security]        | ![status_webapp_security]        |
| ![status_api_coverage]        | ![status_stolas_coverage]        | ![status_logger_coverage]        | ![status_renderer_coverage]        | ![status_storage_coverage]        | ![status_webapp_coverage]        |
| ![status_api_maintainability] | ![status_stolas_maintainability] | ![status_logger_maintainability] | ![status_renderer_maintainability] | ![status_storage_maintainability] | ![status_webapp_maintainability] |
| ![status_api]                 | ![status_stolas]                 | ![status_logger]                 | ![status_renderer]                 | ![status_storage]                 | ![status_webapp]                 |

## The Project
Vitaes is an open source tool with the purpose of making the curriculum creation process easier.
It uses an abstract tree to model the curriculum and compiles it in a PDF.

---
Please note that this project was setup and tested in macOS Mojave 10.14.4 and somethings might break in another environment.
Every software and its versions that are listed bellow are the ones that were used in the tests, newer or earlier versions may work as well.

## Requirements
To work with this project you will need:
- docker-compose
- golang (optional. Get it if you plan to make big changes on any of the golang services. Used v1.12.4)

##### Production only requirements
- [kubectl-aliases](https://github.com/ahmetb/kubectl-aliases) (**PLEASE READ CAREFULY**)
- doctl
---

## Running the project
Choose the environment by running:

| ENVIRONMENT | COMMAND           | READY |
| ----------- | ----------------- | ----: |
| development | `source .dev`     |   YES |
| production  | `source .prod`    |   YES |
| staging     | `source .staging` |    NO |

After switching environments, you have to run the following scripts (on project root):
- `sh scritps/init.sh` (first time on environment only)
- `sh scripts/build.sh`
- `sh scripts/push.sh` (production only, may specify a version (MAJOR, MINOR, PATCH))
- `sh scripts/start.sh`

To stop, run `sh scripts/kill.sh`

## Contributing
You can fork and make a pull request at anytime, fixing an issue or adding a feature you think would be useful.

## Releases
Releases are made in random times, the server is currently running on [vitaes.io](https://vitaes.io/) and can be updated by any of the 2 contributors 

## Notes
In order to enable hot reloading for the webapp while developing in Windows, you need to change the `vitaes-webapp/package.json` start script to `CHOKIDAR_USEPOLLING=true react-scripts start`.


[circleci_status]: https://circleci.com/gh/NeverDefineUs/vitaes/tree/master.svg?style=svg
[status_api]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_api_module&metric=alert_status
[status_stolas]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_stolas_module&metric=alert_status
[status_logger]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_logger_module&metric=alert_status
[status_renderer]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_renderer_module&metric=alert_status
[status_storage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_storage_module&metric=alert_status
[status_webapp]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_webapp_module&metric=alert_status
[status_api_coverage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_api_module&metric=coverage
[status_stolas_coverage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_stolas_module&metric=coverage
[status_logger_coverage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_logger_module&metric=coverage
[status_renderer_coverage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_renderer_module&metric=coverage
[status_storage_coverage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_storage_module&metric=coverage
[status_webapp_coverage]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_webapp_module&metric=coverage
[status_api_maintainability]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_api_module&metric=sqale_rating
[status_stolas_maintainability]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_stolas_module&metric=sqale_rating
[status_logger_maintainability]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_logger_module&metric=sqale_rating
[status_renderer_maintainability]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_renderer_module&metric=sqale_rating
[status_storage_maintainability]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_storage_module&metric=sqale_rating
[status_webapp_maintainability]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_webapp_module&metric=sqale_rating
[status_api_security]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_api_module&metric=security_rating
[status_stolas_security]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_stolas_module&metric=security_rating
[status_logger_security]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_logger_module&metric=security_rating
[status_renderer_security]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_renderer_module&metric=security_rating
[status_storage_security]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_storage_module&metric=security_rating
[status_webapp_security]: https://sonarcloud.io/api/project_badges/measure?project=vitaes_webapp_module&metric=security_rating