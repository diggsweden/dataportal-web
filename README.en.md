# The Swedish dataportal web Client

![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-12.1.6-green)

This is the main repository for the dataportal.se web client.
[https://www.dataportal.se](https://www.dataportal.se)

## EntryScape

The Swedish data portal is tightly integrated with the EntryScape product suite from MetaSolutions AB, https://entryscape.com/en/.
EntryScape Registry is a solution for managing a registry of data catalogs and related information.

## Federerat innehåll

The Swedish Dataportal consumes news and content via a GraphQL proxy. The content is 
rendered with Apollo GraphQl and React. The proxy is not published on Github.

## Environment

Create .env.local file

```sh
LOGSTASH_MODE=tcp
LOGSTASH_HOST=localhost
LOGSTASH_PORT=5000
LOGGING_LEVELS=warn,error,info
LOGFILE_PATH=/app/dataportal.log
PORT=3000
HOST=http://localhost:$PORT
APOLLO_URL=http://localhost:1301
IMAGE_DOMAIN=localhost
REACT_APP_MEDIA_BASE_URL=http://localhost:1337
REACT_APP_RUNTIME_ENV=dev
HTTP_PROXY=https://proxy.digg.se:8080
HTTP_PROXY_USER=secretuser
HTTP_PROXY_PASS=secretpass

HEALTHCHECK_SECRET=123
```

## Development

```sh
yarn
yarn dev
```

Visit [http://localhost:8080](http://localhost:8080) in your browser.

## Development backend rendered

To test the site with a local server, for backend rendering. 

```sh
yarn
yarn build
yarn start
```

Visit [http://localhost:3003](http://localhost:3003) in your browser.

## Stack

- [Nextjs](https://nextjs.org/) JS framework
- [TypeScript](https://www.typescriptlang.org/) for static types
- [React](https://reactjs.org/) for UI
- [Emotion](https://emotion.sh) for styling
- [Apollo Client](https://www.apollographql.com/docs/react/) for federerated content

## Noteringar

This project depends on the `@digg/design-system` package. As of this writing the source code for this package is not published on Github or NPM.