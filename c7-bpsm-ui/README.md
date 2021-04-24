# c7-bpsm-ui

> The Brand Portal Support Manager UI

## Commands

``` bash
# install dependencies
npm i

# serve external admin with hot reload at localhost:8085
npm run dev:external

# serve internal admin with hot reload at localhost:8086
npm run dev:internal

# serve without hot reload minified build
npm run start:dist

# build for deployment
npm run build

# run unit tests
npm run unit

```

## Running Locally

1a. To run the external user admin `npm run dev:external` and view the app in your browser.
1b. To run the internal user admin `npm run dev:internal` and view the app in your browser.

When running `npm run dev:internal`, it is useful and helpful to run local ocelot. To run local ocelot, follow these steps:
1. Download the zip file [here](https://github.platforms.engineering/acs2-foundation/docs/tree/master/user-admin/ocelot.zip)
2. Uncompress the zip file, and place the directory at the root of your machine.
3. In `~/.ocelot/config.js`, fill in the client id and secret with values from vault at `secret/c7/non-prod/permissions-svc`.
4. In `~/.ocelot/routes`, fill in the client id and secret for all entries with values from vault at `secret/c7/non-prod/ping/bpsm_credentials`.
5. Run `npm i -g @monsantoit/locelot`.
6. From the command line, run `ocelot`.
7. Now navigate to `localhost:8889/c7-bpsm-ui/admin/home` on a browser.

## Running Locally using minified build

To run `npm run start:dist` and view the app in your browser.

## Running e2e Visual Tests

For local runs have the following environment variables defined.
```
export APPLITOOLS_TOKEN=
export PORTAL_PASSWORD=
```

Run the tests on your local Chrome.  This will connect to the non-prod instance, login and run the tests.
``` bash
# run the e2e tests for viewport 1024
npm run test:visual:large:local

```

## Running on Cloud Foundry

The `DEPLOYMENT_ENV` must be set to the environment deployed.  This will set what configuration the app should use.
The values are `development` or `production`.

## Committing and Git

While there are [multiple strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)
for versioning models in Git, this project uses [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)
in order simplify development.

In Summary, the `master` branch contains only working code, and _feature_ branches
contain daily developer commits / work-in-progress.


#### Versioning

This repo follows [semver](https://semver.org/):

Given a version number MAJOR.MINOR.PATCH, increment the:

* MAJOR version when you make incompatible API changes,
* MINOR version when you add functionality in a backwards-compatible manner, and
* PATCH version when you make backwards-compatible bug fixes.

