# Home Library Service

## 1 - REST service:

Task-1: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md

How to run this app locally:  
 Steps to get started (for clean project):

- Clone this repo (`dev` branch)
- Install dependencies: `npm install`
- Create `.env` file (based on `.env.example`): `./.env`
- Start Nest JS app by `npm run start`
- Run tests `npm run test`
- You can see Swagger docs on [http://localhost:4000/doc/](http://localhost:4000/doc/)

## 2 - Home Library Service: Part 2 - Containerization, Docker and Database & ORM

Task-2: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/assignment.md

Score-task-2: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/score.md

Deploy:
Prerequisites:

- Free ports: `4000` - for Nest.js app
- Docker desktop installed
- Stop and remove running containers
- Clear (remove) previous images to escape image names conflicts

### Steps to get started (run scripts from the root of the project):

Clone this repo (`dev-part-2` branch)
If you want to start locally - install dependencies: `npm install`
Create `.env` file (based on `.env.example`): `./.env`
Create images for DB and APP: `docker-compose build --no-cache`
Run db and app containers in their inner network: `docker-compose up`
Go to source code root dir and run tests`npm run test`
Try to change something in `/src` (for example `console.log('----FAVS-----', favorites);` in `favorites.service.ts`) and run `npm run test` again
After successful run you can see Swagger docs on [http://localhost:4000/doc/](http://localhost:4000/doc/)

Additionaly:
Built image is pushed to DockerHub - https://hub.docker.com/r/vasilymishanin/nodejs2024q1-service-app - https://hub.docker.com/r/vasilymishanin/nodejs2024q1-service-db_postgres
![Screenshot 2024-03-25 at 23 17 42](https://github.com/vasily-mishanin/nodejs2024Q1-service/assets/58665427/1454bd5d-a3f5-4d33-a13b-bb121aa3d759)  
Implemented npm script for vulnerabilities scanning (free solution)

<img width="902" alt="Screenshot 2024-03-25 at 23 28 09" src="https://github.com/vasily-mishanin/nodejs2024Q1-service/assets/58665427/3ff0f5f8-1c37-441d-8b7a-0df919daa7a0">

Try `npm run audit:docker:app`, `npm run audit:docker:db` or `npm run audit`

Score: `340` / 360

## 3 - REST service: Logging & Error Handling and Authentication and Authorization

Task-3: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/logging-error-authentication-authorization/assignment.md

Score-task-3: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/logging-error-authentication-authorization/score.md

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
