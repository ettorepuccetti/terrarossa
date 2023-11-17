# Terrarossa notes

## Next.js

```
npm run dev
```

## DB

### Planetscale

(optional)

```
brew install planetscale/tap/pscale
pscale connect terrarossa main --port 3309
How can
```

altrimenti connettersi direttamente con `DATABASE_URL` in `.env`

### Prisma

#### Seed

```
npx prisma db seed
```

#### Prisma studio

```
npx prisma studio
```

#### Reset

to reset the database (delete all data!!):

```
npx prisma db push --force-reset
```

### Docker

For local development and testing.
In `DATABASE_URL` cambiare username: `root` e password: `secret`

`docker run --name mysql-terrarossa -e MYSQL_ROOT_PASSWORD=secret -p 3306:3306 -d mysql`

### DB changes

in `.env` cambiare il `DATABASE_URL` a quello del branch
riavviare `npm run dev`

```
npx prisma db push
npx prisma generate
```

(reminder: cambiamenti ai prisma tag non richiedono deployment, si riflettono solo su prisma studio e prisma generate).
Mergiare da planetscale.com

#### Incorporating databases into your ci cd pipeline

From [webinar](https://planetscale.com/media/incorporating-databases-into-your-ci-cd-pipeline):<br>
Schema before code (almost always). <br> Two github actions:

Run db migration:

- if pull request opened and changes to schema file:
  - create a new db branch (check if already exists, since this workflow is triggered on subsequent pushes on same PR)
  - proxy the db connection to the new created branch on planetscale
  - run the migration (prisma db push)
  - comment on the PR the diff in schema changes (_very_ optional)
  - check if the DR already exists and close it, in that case
  - open DR on planetscale (branch name of DB = branch name on GH)

Deploy schema then code:

- if the PR has been merged and there's a DR with same branch name:
  - merge the DR on Planetscale (and wait for it)
  - deploy to vercel

### Prisma cloud platform

- in `db.ts` add `.$extends(withAccelerate())` after `new PrismaClient({...})`

```
// src/server/db.ts

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient({...}).$extends(withAccelerate());
```

- Temporary use `DATABASE_URL_PRISMA` instead of `DATABASE_URL`

## Privacy policy

generated using https://www.freeprivacypolicy.com/free-terms-and-conditions-generator/
account: terrarouge.vercel@gmail.com

## Cypress

```
npm run cypress
```

to avoid missing env variables, in package.json use:

```
"scripts": {
  "cypress": "NODE_ENV='test' cypress open"
}
```

flaky VSCode type error in .tsx file, how to solve:

in `cypress/tsconfig.json` add:

```
"module": "NodeNext",
"jsx": "preserve",
"include": [..., "**/*.tsx"]
"baseUrl": "..",
    "paths": {
      "~/*": ["./src/*"]
    },
```

then, for solving import type from `@FullCalendar/core`, add:

```
"module": "esnext",
"moduleResolution": "node",
"allowSyntheticDefaultImports": true,
```

### Missing linting in cypress files

I got several build failures because VSCode or eslint does not checking for "possible undefined" related errros. To have those checking, I added this option to `cypress/tsconfig.json`

```
    "noUncheckedIndexedAccess": true,
```

### MUI pickers and Cypress on Github Actions

Since chrome in Github actions run in headless mode, it has `pointer: none`. This make MUI pickers render in mobile mode, and do not accept text input (readonly, it render instead a visual clock for touch commands).

#### Working solution

To configure chrome to always use `pointer: fine`, let's add a configuration string to chrome's launch command.
Put this in `cypress.config.js`, in the section `setupNodeEvents(on, config) {...}`

```
on("before:browser:launch", (browser, launchOptions) => {
  if (browser.family === "chromium" && browser.name !== "electron") {
    launchOptions.args.push("--blink-settings=primaryPointerType=4");
    return launchOptions;
  }
});
```

#### Not working solution

Another approach would be to use the Chrome Devtools Protocol (CDP). Something like this:

```
Cypress.automation("remote:debugger:protocol", {
  command: 'Emulation.setTouchEmulationEnabled',
  params: {
    enabled: true
  }
})
```

or

```
Cypress.automation("remote:debugger:protocol", {
  command: "Emulation.setEmulatedMedia",
  params: {
    media: "all",
    features: [{ name: "pointer", value: "fine" }],
  },
})
```

However, I didn't find how to emulate the pointer type media query correctly.

### Re-enable parallelization on Cloud

at job level (before `steps`):

```
strategy:
  fail-fast: false
  matrix:
    containers: [1, 2, 3]
```

under option of `cypress-io/github-action@v5`:

```
record: true
parallel: true
group: "UI - Chrome [ - mobile]"
```

### Environment variables

[source](https://docs.cypress.io/guides/guides/environment-variables)

#### 1. `cypress.config.ts`

```
export default defineConfig({
  env: {
    login_url: '/login',
  },
})
```

became accessible in test file as

```
Cypress.env('login_url') // '/login'
```

#### 2. `cypress.env.json`

```
{
 login_url: '/login_local',
}
```

#### 3. `CYPRESS_*`

Any exported environment variables set on the command line or in your CI provider that start with either `CYPRESS*` or `cypress*` will automatically be parsed by Cypress.

Environment variables that do not match configuration options will be set as environment variables for use in tests with `Cypress.env()`, and will override any existing values in the Cypress configuration `env` object and `cypress.env.json` files.

example, from command line:

```
export CYPRESS_api_server=http://localhost:8888/api/v1/
```

in test:

```
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

#### 4. `--env`

from command line:

```
cypress run --env api_server=http://localhost:8888/api/v1
```

## Github Actions

### Skip pull request and push workflows

If any commit message in your push or the HEAD commit of your PR contains the strings `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, or `[actions skip]` workflows triggered on the push or pull_request events will be skipped.

### Vercel manual deploy

How to get secrets for vercel,
from [this guide](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel):

- Retrieve your Vercel [Access Token](https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token)
- Install the [Vercel CLI](https://vercel.com/cli) and run `vercel login`
- Inside your folder, run `vercel link` to create a new Vercel project
- Inside the generated `.vercel` folder, save the `projectId` and `orgId` from the `project.json`
- Inside GitHub, add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as secrets

### Get commit info (like committer)

on push event:
`github.event.head_commit.committer.name`

### Update deployment section in github repo

Using these actions:

- [deployment-action](https://github.com/marketplace/actions/deployment-action)
- [deployment-status](https://github.com/marketplace/actions/deployment-status)

Currently applied only for preview environment. On new deploy, it mark the old ones as inactive. Check how to handle the case of having more than one active branches (also in case of renovate bot opening PR).

## Linting before commit

install husky and lint-staged:

```

npx husky-init
npm install --save-dev lint-staged
npx husky set .husky/pre-commit "npx lint-staged"

```

configure lint-staged in `package.json`:

```
"lint-staged": {
    "*": "prettier --ignore-unknown --write"
  },
```

run once:

```
npm run prepare
```

On each commit, husky will run lint-staged, which will run prettier on all staged files.

## Providing context to component in Cypress component testing

General concept:
https://blog.zenika.com/2022/10/07/a-few-ways-to-approach-cypress-component-testing-with-react-components/
https://github.com/Ked57/cypress-ct-example-app

Zustand:
https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.md

React Query:
https://tkdodo.eu/blog/testing-react-query

## MSW (in case I want to mock the network for testing)

https://github.com/maloguertin/msw-trpc

How to use with cypress (when to initialize service worker)
https://github.com/mswjs/msw/issues/1560
https://www.capocaccia.dev/posts/cypressMsw

libraries or example on top of msw:
https://github.com/deshiknaves/cypress-msw-interceptor
https://github.com/abrahamgr/msw-cypress

discussion on trpc repo on how to mock calls:
https://github.com/trpc/trpc/discussions/1879

## Ignoring commit in git blame:

https://akrabat.com/ignoring-revisions-with-git-blame/

- add the file `.git-blame-ignore-revs`
- run: `git config blame.ignoreRevsFile .git-blame-ignore-revs`
- write the 40 chars commit hash in it of the commit to ignore

## Logs

Pino logger + Logflare. Code example repo: [next-pino-logflare-logging-example
](https://github.com/Logflare/next-pino-logflare-logging-example)

It use the vercel log drain + logflare vercel [integration](https://vercel.com/integrations/logflare) for logging lambda (server side), and POST request to logdrain client side, everything using the same [logger object](https://github.com/Logflare/next-pino-logflare-logging-example/blob/main/logger/logger.js).

Log [child](https://github.com/pinojs/pino/blob/master/docs/child-loggers.md) for logging the LOGKEY of each component using the logger.

### Server side

On logflare, once installed the integration, create a source (`terrarossa.vercel` in this case) and a log drain that will collect logs from vercel project (so all kind of log: static request, build, lamdba, etc.) and send them to the created source. It is possible for a given source to create a rule which redirect filtered log to another source (`terrarossa.vercel.build` for instance).

### Client side

Create another source (optional) and get `SOURCE_ID` and `API_KEY` for initialize the logger object in the code.

## NODE_ENV (for enabling features client side)

Nextjs actually support only two values: `development` and `production` (see this [discussion](https://github.com/vercel/next.js/issues/17032#issuecomment-691491353)).
To overcome this, best option is to use `APP_ENV`. Since it needs to be read client side, it became:
`NEXT_PUBLIC_APP_ENV` = `production` | `development` | `test`

### Environment Variable Load Order

Environment variables are looked up in the following places, in order, stopping once the variable is found ([source](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)).

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (Not checked when `NODE_ENV` is `test`.)
4. `.env.$(NODE_ENV)`
5. `.env`

### `.env`:

```
NODE_ENV="development"
NEXT_PUBLIC_APP_ENV="development"

```

### `cypress-testing.yml`:

```
env:
  NODE_ENV="development"
  NEXT_PUBLIC_APP_ENV="test"

```

### `package.json`:

```
    "dev": "next"

    "dev:test": "NEXT_PUBLIC_APP_ENV='test'

    "cypress": "NEXT_PUBLIC_APP_ENV='test' cypress open",

    "cypress-run": "npx cypress run",

    "cypress-run-component": "NEXT_PUBLIC_APP_ENV='test' npx cypress run --component",
```

### Local development

I set `NEXT_PUBLIC_APP_ENV="development"`
in `.env` file. Easy as that

TODO: What if I want to make a production build locally and run that one (with variable set to production)?

### Vercel

I set an env variable to `NEXT_PUBLIC_APP_ENV="production"`. Easy

### Cypress

I need to set that variable to `test` both locally and on the CI, for both e2e testing and component testing

#### Locally

E2E: I need to run the local dev server with that variable set to `test`. Unfortunalty now I cannot use anymore the same instance of the server for both development and testing.
Cypress depend on the NEXT_PUBLIC_APP_ENV set when the server is launched.

- start local server: `npm run dev:test` = `"NEXT_PUBLIC_APP_ENV='test' npm run dev"` (since `process.env` take precedence of what is defined in `.env` file)
- start cypress: `npm run cypress`

COMPONENT: I can set `NEXT_PUBLIC_APP_ENV='test'` from the command line before lunching `npm run cypress` and that value will be read correctly, since component testing does not depend from local server

- start cypress: `npm run cypress` = `"NEXT_PUBLIC_APP_ENV='test' cypress open"`

#### on CI

env variables are set in the `env` section of the `.yml` file, so it should be enough to set `NEXT_PUBLIC_APP_ENV='test'` in the workflow file, no other dependecies.
NO! I need to set also `"NEXT_PUBLIC_APP_ENV='test'` in the build command used for building the nextjs project

## DEMO env

### Vercel

- [Vercel project](https://vercel.com/ettorepuccetti/terrarossa-demo)
- URL: https://terrarossa-demo.vercel.app

Extract `projectId` from `.vercel` folder and saved on Github secrets as `VERCEL_PROJECT_ID_DEMO`

### Planetscale

- [db demo](https://app.planetscale.com/terrarouge-vercel/terrarossa-demo) saved in vercel secrets as `DATABASE_URL`.

Create service token for accessing through CLI as described [here](https://planetscale.com/docs/concepts/service-tokens)

Save new service token as Github secrets `PLANETSCALE_SERVICE_TOKEN_ID_DEMO` and `PLANETSCALE_SERVICE_TOKEN_DEMO`.

### Auth0

New app under `terrarossa.auth0.` provider
Get this values to be saved as Vercel secrets:

- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_ISSUER` (same as prod env)
- `AUTH0_BASE_URL` (https://terrarossa-demo.vercel.app)

### Workflow on GH Action

It needs these secrets:

- `VERCEL_ORG_ID`: ${{ secrets.VERCEL_ORG_ID }}
- `VERCEL_PROJECT_ID`: ${{ secrets.VERCEL_PROJECT_ID_DEMO }}
- `PLANETSCALE_SERVICE_TOKEN_ID`: ${{ secrets.PLANETSCALE_SERVICE_TOKEN_ID_DEMO }}
- `PLANETSCALE_SERVICE_TOKEN`: ${{ secrets.PLANETSCALE_SERVICE_TOKEN_DEMO }}
- `PSCALE_BRANCH_NAME`: main
- `database name`: ${{secrets.PLANETSCALE_DATABASE_NAME}}-demo

1. install prisma and pscale cli
2. connect to demo db through pscale cli and launch reset and seed command
3. install vercel cli
4. deploy in production on vercel
