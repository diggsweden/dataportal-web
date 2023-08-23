![Swedish data portal](https://www.dataportal.se/images/svdp-favicon-64.png) 
# The Swedish data portal web Client – [dataportal.se](https://www.dataportal.se)

## Stack
![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-13.0.2-green)
- [Nextjs](https://nextjs.org/) JS framework
- [TypeScript](https://www.typescriptlang.org/) for static types
- [React](https://reactjs.org/) for UI
- [Emotion](https://emotion.sh) for styling
- [Apollo Client](https://www.apollographql.com/docs/react/) for federerated content

## Development
Start by create an ```env.local``` file. Use the ```env.local.example``` as template.
(Environment variables and tokens in env.local.example that has placeholder value of "secret" is not available here and needs to be fetched from BitWarden).

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
Run:
```sh
yarn
yarn build
yarn start
```
Visit [http://localhost:3000](http://localhost:3000) in the browser.

### Start application with Docker
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

### EntryScape
The Swedish data portal is tightly integrated with the EntryScape product suite from MetaSolutions AB, https://entryscape.com/en/.
EntryScape Registry is a solution for managing a registry of data catalogs and related information.

### Content backend
The Swedish Dataportal consumes news and content via a GraphQL proxy. The content is
rendered with Apollo GraphQl and React. The proxy is not published on Github.

### Component library
The project has a dependency to [Digg component library](https://github.com/DIGGSweden/react-component-library).
The package is published via NMP under [`@digg/design-system`](https://www.npmjs.com/package/@digg/design-system)

### Videos
Display of video is done via [screen9](https://screen9.com/). To be able to display videos an account from screen9 is needed and an API key. ¨
The key for this frontend application has read access only to DIGG screen9 account.
