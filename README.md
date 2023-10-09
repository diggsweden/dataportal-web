![Swedish data portal](https://www.dataportal.se/images/svdp-favicon-64.png) 
# The Swedish data portal web client – [dataportal.se](https://www.dataportal.se)
Sweden´s national data portal gathers and shares data for re-use to make it easier for users to find and explore it across sectors and domains.The portal only contains information about datasets, i.e. metadata. The actual datasets are retrieved via links for download or requested by the respective organization responsible for their own datasets. The Agency for Digital Government (DIGG) is responsible for Sweden's national data portal.


## Entryscape
[<img alt="Entryscape logotype" src="https://entryscape.com/wp-content/uploads/2023/01/Entryscape-by-Metasolutions-w385px-Retina-2.png" width="191" height="42">](https://entryscape.com/en)

The Swedish data portal is tightly integrated with the EntryScape product suite from MetaSolutions AB.
EntryScape Registry is a solution for managing a registry of data catalogs and related information

## Requirements
![node-current](https://img.shields.io/badge/node-18.18.0-green)
![npm-current](https://img.shields.io/badge/npm-9.8.1-green)
![nextjs-current](https://img.shields.io/badge/nextjs-13.0.2-green)

## Development
Start by creating an ```.env.local``` file. Use the ```.env.local.example``` as template.
(Environment variables and tokens in .env.local.example that has placeholder value of "secret" is not available here and needs to be changed to a valid value).

### Run application in development mode
Starts the application in development mode with hot-code reloading, error reporting, and more. See [Nextjs Development](https://nextjs.org/docs/app/api-reference/next-cli#development) for more information.
Run:
```sh 
yarn
yarn dev
# If you are having issues connecting to your localhost port for apollo:
export NODE_OPTIONS=--dns-result-order=ipv4first
```
Visit [http://localhost:3000](http://localhost:3000) in the browser.

### Run application in production mode
Builds the application for production usage. See [Nextjs production build](https://nextjs.org/docs/app/api-reference/next-cli#build) for more info.
And Start the Next.js production server. See [Nextjs start production](https://nextjs.org/docs/app/api-reference/next-cli#production) for more info.
Run:
```sh
yarn
yarn build
yarn start
```
Visit [http://localhost:3000](http://localhost:3000) in the browser.

### Run application with Docker
Run the following to start the application with docker.
```sh
#build image
docker build . -t dataportal-web

# Create container
docker run -p 3000:3000 -e PORT=3000 -e HOST=http://localhost:3000 -e REACT_APP_APOLLO_URL=http://localhost:1400 -e REACT_APP_RUNTIME_ENV=prod -e IMAGE_DOMAIN=host.docker.internal -e REACT_APP_MEDIA_BASE_URL="http://host.docker.internal:1400/assets/dataportal" --add-host=host.docker.internal:host-gateway dataportal-web
```

### Health check
NextJs answers on [http://localhost:1300/api/healthcheck?secret=[HEALTHCHECK_SECRET from env]](http://localhost:1300/api/healthcheck?secret=)
No cache, Do a request to content backend with startpage query.

```sh
{"status":"fail"}
```

```sh
{"status":"pass"}
```

## Notes

### Stack
- [![Nextjs](https://badgen.net/badge/Nextjs/JS%20framework/blue)](https://nextjs.org/) 
- [![TypeScript](https://badgen.net/badge/TypeScript/For%20static%20types/blue)](https://www.typescriptlang.org/)
- [![React](https://badgen.net/badge/React/For%20UI/blue)](https://reactjs.org/)
- [![Emotion](https://badgen.net/badge/Emotion/For%20styling/blue)](https://emotion.sh)
- [![Apollo Client](https://badgen.net/badge/Apollo%20Client/For%20federated%20content/blue)](https://www.apollographql.com/docs/react/)


### Content backend
The Swedish Dataportal consumes news and content via a GraphQL proxy. The content is
rendered with Apollo GraphQl and React. The proxy is not published on Github.

### Component library
The project has a dependency to [Digg component library](https://github.com/DIGGSweden/react-component-library).
The package is published via NMP under [`@digg/design-system`](https://www.npmjs.com/package/@digg/design-system)

### Videos
[<img alt="Screen9 logotype" src="https://screen9.com/wp-content/uploads/Screen9-logo-Black-CMYK.svg" width="150" height="30">](https://screen9.com/)

Display of video is done via [screen9](https://screen9.com/). To be able to display videos an account from screen9 is needed and an API key.
The key for this frontend application has read access only to DIGG screen9 account.
