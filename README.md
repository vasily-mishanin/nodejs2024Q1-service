# Home Library Service

Task-3: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/logging-error-authentication-authorization/assignment.md

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Free ports: `4000` - for Nest.js app.
- Docker desktop installed.
- **Stop** and **remove** running containers (`docker-compose down`) from previous cross-check.
- Clear (remove) previous images from previous cross-check (using Docker Desktop or terminal).

```
docker image rm [IMAGE_ID_OR_NAME...]
```

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

### Steps to get started (run scripts from the root of the project):

#### Clone this repo (`dev-part-3` branch)

```
 git clone <link to this repo>
```

#### Checkout dev-part-3 branch

```
 git checkout dev-part-3
```

#### Install dependencies

```
 npm install
```

#### Rename `.env.example` to `.env`

#### Create images for DB and APP containers:

```
docker-compose build --no-cache
```

#### Run db and app containers in their inner network:

```
docker-compose up
```

#### Now Nest.js app should be running on port 4000

#### Postgres DB should be running on port 5432

#### You can run tests:

```
npm run test:auth
npm run test:refresh
```

**_ATTENTION:_** If tests are not passed - try to clear database (especially **_users_** table) using tools like **_DBeaver_** or **_DataGrip_**

#### After successful run you also can see Swagger docs on [http://localhost:4000/doc/](http://localhost:4000/doc/)

#### log files are avalable at `/dist/logging/logs`

## Running application locally (connection with local database must be configured)

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
