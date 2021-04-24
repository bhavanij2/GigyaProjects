# User Administration Service
> The codebase for the C7 User Administration Service

### Running Locally
You will need a .env file to run locally

0. install and run Neo4J locally
1. clone repo
2. configure `.env`
3. `npm install`
4. `npm start`
5. view [http://localhost:3001/v1/status](http://localhost:3001/v1/status)

### Configuring .env

`LOCAL_USER_PROFILE` [ Boolean ] - Sets a federationId for the user-profile middleware

If `LOCAL_USER_PROFILE` is set to `true` in your `.env` file or exported, the user administration service will use the federationId provided by the `@monsantoit/cloud-foundry` package. This is useful for local development without the need to launch the instance in CF to have access to a user profile.

The .env file can be obtained from Vault. A config for `national.dealer@monsanto.com` can be found by running the following vault command:

```bash
vault read secret/c7/fargate-non-prod/env/user-admin
```

> Note: this vault is specific to the national.dealer@monsantoit.com, and is running with a version of the non-prod neo4j db. Instructions to connect to that database can be found at https://github.platforms.engineering/acs2-foundation/docs/wiki/Neo4j-nonprod-ssh-config.

#### Customize .Env file for your user

1. In your browser, for the non-prod instance of portal, append `portal/auth-token-info?` to the end of your url.
2. Retrieve the user data, and update the `user-profile` section of the vault .env file.
3. Run your app.

### Running Postman Tests

In order to ensure the changes to the c7-user-administration-server API are fully functional, there is a postman collection
that validates the changes based on baselines. The collection is in `test/postman` along with a file that contains variables
utilizes in the postman collection, `test/postman/data.json`.

In order to run the tests, run the following two commands with neo4j running in the background.

0.  Setup neo4j: https://github.platforms.engineering/acs2-foundation/docs/wiki/Neo4j-nonprod-ssh-config.
1. With neo4j set up, connect to the neo4j instance, run `ssh acs2-c7-neo4j-test-i1`
2. In this root directory of this project, run `npm run start`
3. In a separate terminal, same directory, run `npm run postman`

### Prod Sample Data
```bash
bash ./import/prod/prod-data-import.sh  <local neo4j password>
```


### Non-Prod Sample Data

To fill a local neo4j database instance with sample data, run the following command in terminal.
This will delete all your existing data.

```bash
bash ./import/non-prod/reset-sample.sh <local neo4j password>
```

### Setting up variables
Add entries to spectrum.config.json for prod and non-prod, for local developmenta add variables to your .env file


### Running Performance Tests

0. Install Artillery package: `npm i -g artillery`
1. Get a Gigya token for a user with permissions in the target environment
2. Paste the gigya token into the Authorization header `Authorization: 'Bearer <gigya token>`
3. Run `artillery run test/performance/dealer.yml -e nonprod`

`-e` is the environment value which can be either `local` or `nonprod`

### One time import of existing users into entitlements database

```
npm run dev
```

on another terminal run
```bash
bash ./import/import-users.sh
```

### View swagger

Copy contents of src/server/v1/swagger/swagger.json in the [swagger editor](https://editor.swagger.io/)

OR

http://localhost:3001/api-docs/

### Swaggifying old routes

See `/src/server/rest/healthcheck` for a simple example.
More docs can be found at: https://github.com/lukeautry/tsoa.

Steps:
1. Pick route
2. Create route controller file
3. Create class with `@Route` decorator imported from `tsoa`. Example:
    - File: myrouteController.ts
    ```ts
    import { Get, Route, Controller } from 'tsoa';
    import ExampleResponse from './types';

    @Route('v1/myroute')
    export class MyRoute extends Controller {
        // ...
    }
    ```
4. Add REST methods to controller
    ```ts
    import { Get, Route, Controller } from 'tsoa';
    import ExampleResponse from './types';

    @Route('v1/myroute')
    export class MyRoute extends Controller {
        @Get()
        public getExampleResponse(): ExampleResponse {
            return {
                data: 'hello world',
            };
        }
    }
    ```
5. import the controller file in `router.ts`, `app.ts`, or any file that webpack will reach from the root entry file.
    - example: in `src/server/v1/rest/router.ts`, add `import <path-to-myrouteController.ts>`
6. To generate the route, run `npm run routes`
7. To add your route into the swagger config json, run `npm run swagger`
8. Note: both steps 6 and 7 are part of the build process
9. Run `npm run serve`, and navigate to `<base-url>/api-docs` to see the documentation.
    - For development, you can run `npm run dev`, and this will enable hot reloading
        - NOTE: Hot module reloading will not execute the generation steps for the routes and swagger automatically. However, if you run `npm run routes && npm run swagger` while the app is running, the app will reload and your changes will be reflected after running the script.
