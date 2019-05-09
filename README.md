# Vitaes
## The Project
This project(Vitaes) is an open source server with the purpose of making it easier resume creation.
It uses an abstract tree to model the curriculum and compiles it in a PDF.
## How to run it
### First Run
First you need a project on firebase, and replace the credentials on front/src/config.js.
Download docker-compose and run `setup.sh` and then `deploy.sh`.
### Next runs
Run `docker-compose up --build` on the main directory does the trick.
## Contributing
You can fork and make a pull request at anytime, fixing an issue or adding a feature you think would be useful.
(you might need to use sudo on git commit, if you need sudo to run docker-compose)
## Releases
Releases are made in random times, the server is currently running on vitaes.io and can be updated by any of the 2 contributors 
## Notes
In order to enable hot reloading for the webapp while developing in Windows, you need to change the `vitaes-webapp/package.json` start script to `CHOKIDAR_USEPOLLING=true react-scripts start`.
