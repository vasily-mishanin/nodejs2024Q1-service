# Home Library Service

### 1 - REST service:

Task-1: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md

How to run this app locally:  
 Steps to get started (for clean project):

- Clone this repo (`dev` branch)
- Install dependencies: `npm install`
- Create `.env` file (based on `.env.example`): `./.env`
- Start Nest JS app by `npm run start`
- Run tests `npm run test`
- You can see Swagger docs on [http://localhost:4000/doc/](http://localhost:4000/doc/)

### 2 - Home Library Service: Part 2 - Containerization, Docker and Database & ORM

Task-2: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/assignment.md

Task-3: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/score.md

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
