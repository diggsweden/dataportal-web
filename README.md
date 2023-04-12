# Sveriges dataportal webbklient

![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-13.0.2-green)

Här finns källkoden för dataportalens webbklient
[https://www.dataportal.se](https://www.dataportal.se)

## EntryScape

Den svenska dataportalen är starkt integrerad med produktsviten EntryScape från MetaSolutions AB, [https://entryscape.com/sv/](https://entryscape.com/sv/).
EntryScape Registry är en lösning för att hantera ett register över datakataloger och relaterad information.

## Content backend

Utvecklarportalen hämtar innehåll via Apollo Gateway. Sätts via env.

## Environment

Skapa en .env.local

```sh
LOGSTASH_MODE=tcp
LOGSTASH_HOST=localhost
LOGSTASH_PORT=5000
LOGGING_LEVELS=warn,error,info
LOGFILE_PATH=/app/dataportal.log
PORT=3000
HOST=http://localhost:$PORT
APOLLO_URL=http://localhost:1301 #server apollo client
REACT_APP_APOLLO_URL=http://localhost:1301 #browser apollo client
IMAGE_DOMAIN=localhost
REACT_APP_MEDIA_BASE_URL=http://localhost:1337
REACT_APP_RUNTIME_ENV=dev
HTTP_PROXY=http://proxy.digg.se:8080
HTTP_PROXY_USER=secretuser
HTTP_PROXY_PASS=secretpass
REACT_APP_SCREEN9_API_TOKEN=secret

HEALTHCHECK_SECRET=123
```

## Utveckling

```sh
yarn
yarn dev
```

Gå till [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Lokal server

För att testa applikationen kör följande:

```sh
yarn
yarn build
yarn start
```

Besök [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Produktionsbygge

Bygg för produktion genom att köra följande:

```sh
yarn build
```

Detta kommer generera applikationen som statiska filer under .next-mappen.

## Docker

```sh
#bygg image
docker build . -t dataportal-web

#skapa container
docker run -p 3000:3000 -e PORT=3000 -e HOST=http://localhost:3000 -e REACT_APP_APOLLO_URL=http://localhost:1400 -e REACT_APP_RUNTIME_ENV=prod -e IMAGE_DOMAIN=host.docker.internal -e REACT_APP_MEDIA_BASE_URL="http://host.docker.internal:1400/assets/dataportal" --add-host=host.docker.internal:host-gateway dataportal-web
```

## Health check

NextJs svarar på [http://localhost:1300/api/healthcheck?secret=[HEALTHCHECK_SECRET från env]](http://localhost:1300/api/healthcheck?secret=)
Cacheas inte, gör en request till contentbackend med startsidans fråga.

```sh
{"status":"fail"}
```

```sh
{"status":"pass"}
```

## Stack

- [Nextjs](https://nextjs.org/) JS framework
- [TypeScript](https://www.typescriptlang.org/) typad JS
- [React](https://reactjs.org/) för UI
- [Emotion](https://emotion.sh) för styling
- [Apollo Client](https://www.apollographql.com/docs/react/) för datahämtning

## Noteringar

### Komponentbibliotek
Projektet har ett beroende till [Diggs komponentbibliotek](https://github.com/DIGGSweden/react-component-library).
Detta paket finns publicerat på NPM under [`@digg/design-system`](https://www.npmjs.com/package/@digg/design-system)

### Videos
Visning av videofilmer görs via videospelaren [screen9](https://screen9.com/). För att kunna visa filmer krävs ett konto hos screen9 och en API-nyckel.
