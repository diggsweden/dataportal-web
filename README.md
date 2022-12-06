# Sveriges dataportal webbklient

![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-12.1.6-green)

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
docker build . -t nextjs-dataportal

#skapa container
docker run -p 3002:3002 -e PORT=3002 -e HOST=http://localhost:3002 -e REACT_APP_APOLLO_URL=http://localhost:1400 -e REACT_APP_RUNTIME_ENV=prod -e IMAGE_DOMAIN=host.docker.internal -e REACT_APP_MEDIA_BASE_URL="http://host.docker.internal:1400/assets/dataportal" --add-host=host.docker.internal:host-gateway nextjs-dataportal
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

Projektet har ett beroende till Diggs designsystemspaket `@digg/design-system`.
I skrivande stund är källkoden till detta paket inte publicerad på Github eller NPM.
