![Swedish data portal](https://www.dataportal.se/images/svdp-favicon-64.png)

# The Swedish data portal web client – [dataportal.se](https://www.dataportal.se)

Sweden´s national data portal gathers and shares data for re-use to make it easier for users to find and explore it across sectors and domains.The portal only contains information about datasets, i.e. metadata. The actual datasets are retrieved via links for download or requested by the respective organization responsible for their own datasets. The Agency for Digital Government (DIGG) is responsible for Sweden's national data portal.

## Entryscape

[<img alt="Entryscape logotype" src="https://entryscape.com/wp-content/uploads/2023/01/Entryscape-by-Metasolutions-w385px-Retina-2.png" width="191" height="42">](https://entryscape.com/en)

The Swedish data portal is tightly integrated with the EntryScape product suite from MetaSolutions AB.
EntryScape Registry is a solution for managing a registry of data catalogs and related information

## Requirements

![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-12.1.6-green)

## Development

Start by creating an `.env.local` file. Use the `.env.local.example` as template.
(Environment variables and tokens in .env.local.example that has placeholder value of "secret" is not available here and needs to be changed to a valid value).

### Run application in development mode

Starts the application in development mode with hot-code reloading, error reporting, and more. See [Nextjs Development](https://nextjs.org/docs/app/api-reference/next-cli#development) for more information.
Run:

```sh
yarn
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in the browser.

### Run application in production mode

Builds the application for production usage. See [Nextjs production build](https://nextjs.org/docs/app/api-reference/next-cli#build) for more info.
And Start the Next.js production server. See [Nextjs start production](https://nextjs.org/docs/app/api-reference/next-cli#production) for more info.

Use real data from dataportalen.se by using the variables under "Connect to production backend. (dataportal.se)." in env.local.example file.
Run:

```sh
yarn
yarn build
yarn start
```

Visit [http://localhost:3000](http://localhost:3000) in the browser.

### Run application with Docker

```sh
#build image
docker build . -t nextjs-dataportal

#create container
docker run -p 3002:3002 -e PORT=3002 -e HOST=http://localhost:3002 -e REACT_APP_APOLLO_URL=http://localhost:1400 -e REACT_APP_RUNTIME_ENV=prod -e IMAGE_DOMAIN=host.docker.internal -e REACT_APP_MEDIA_BASE_URL="http://host.docker.internal:1400/assets/dataportal" --add-host=host.docker.internal:host-gateway nextjs-dataportal
```

### Health check

NextJs answers on [http://localhost:1300/api/healthcheck?secret=[HEALTHCHECK_SECRET from env]](http://localhost:1300/api/healthcheck?secret=)
Not cached, make a request to the content backend with the home page's query.

```sh
{"status":"fail"}
```

```sh
{"status":"pass"}
```

## Stack

- [![Nextjs](https://badgen.net/badge/Nextjs/JS%20framework/blue)](https://nextjs.org/)
- [![TypeScript](https://badgen.net/badge/TypeScript/For%20static%20types/blue)](https://www.typescriptlang.org/)
- [![React](https://badgen.net/badge/React/For%20UI/blue)](https://reactjs.org/)
- [![Emotion](https://badgen.net/badge/Emotion/For%20styling/blue)](https://emotion.sh)
- [![Apollo Client](https://badgen.net/badge/Apollo%20Client/For%20federated%20content/blue)](https://www.apollographql.com/docs/react/)

## Notes

### Content backend

The Swedish Dataportal consumes news and content via a GraphQL proxy. The content is
rendered with Apollo GraphQl and React. The proxy is not published on Github.

### Component library

The project has a dependency to [Digg component library](https://github.com/DIGGSweden/react-component-library).
The package is published via NMP under [`@digg/design-system`](https://www.npmjs.com/package/@digg/design-system)
