# Vitaes
## The Project
This project(Vitaes) is an open source server with the purpose of making it easier resume creation.
It uses an abstract tree to model the curriculum and compiles it in a PDF.

---
Please note that this project was setup and tested in macOS Mojava 10.14.4 and somethings might break in another environment.
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
| development | `source .dev`     | YES   |
| production  | `source .prod`    | YES   |
| staging     | `source .staging` | NO    |

After switching environments, you have to run the following scripts (on project root):
- `sh scritps/init.sh` (first time on environment only)
- `sh scripts/build.sh`
- `sh scripts/push.sh` (production only)
- `sh scripts/start.sh`

To stop, run `sh scripts/kill.sh`

## Contributing
You can fork and make a pull request at anytime, fixing an issue or adding a feature you think would be useful.

## Releases
Releases are made in random times, the server is currently running on [vitaes.io](https://vitaes.io/) and can be updated by any of the 2 contributors 

## Notes
In order to enable hot reloading for the webapp while developing in Windows, you need to change the `vitaes-webapp/package.json` start script to `CHOKIDAR_USEPOLLING=true react-scripts start`.
