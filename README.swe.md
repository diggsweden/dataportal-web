![Sveriges dataportal](https://www.dataportal.se/images/svdp-favicon-64.png)
# Sveriges dataportal webbklient – [dataportal.se](https://www.dataportal.se)

## Stack
![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-13.0.2-green)
- [Nextjs](https://nextjs.org/) JS framework
- [TypeScript](https://www.typescriptlang.org/) typad JS
- [React](https://reactjs.org/) för UI
- [Emotion](https://emotion.sh) för styling
- [Apollo Client](https://www.apollographql.com/docs/react/) för datahämtning

## Utveckling.
Börja med att skapa en ```env.local``` fil. Använd ```env.local.example``` som mall.
(Env-variabler och tokens i env.local.example som har en värdet "secret" är inte tillgängliga här och behöver hämtas från BitWarden).

### Kör applikationen i utvecklingsläge.
Starta applikationen i utvecklingsläge med "hot-code"-omladdning, felrapportering m.m. Se: [Nextjs Development](https://nextjs.org/docs/app/api-reference/next-cli#development) för mer information.
Kör:
```sh
yarn
yarn dev
```
Besök [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Kör applikationen i productionsläge.
Bygger applikationen i produktionsläge. Se [Nextjs production build](https://nextjs.org/docs/app/api-reference/next-cli#build) för mer info.
Och startar Next.js produktionsservern. Se [Nextjs start production](https://nextjs.org/docs/app/api-reference/next-cli#production) för mer info.
Kör:
```sh
yarn
yarn build
yarn start
```
Besök [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Starta applikationen med Docker.

```sh
#build image
docker build . -t dataportal-web

# Create container
docker run -p 3000:3000 -e PORT=3000 -e HOST=http://localhost:3000 -e REACT_APP_APOLLO_URL=http://localhost:1400 -e REACT_APP_RUNTIME_ENV=prod -e IMAGE_DOMAIN=host.docker.internal -e REACT_APP_MEDIA_BASE_URL="http://host.docker.internal:1400/assets/dataportal" --add-host=host.docker.internal:host-gateway dataportal-web
```

## Notes

### EntryScape
Den svenska dataportalen är starkt integrerad med produktsviten EntryScape från MetaSolutions AB, [https://entryscape.com/sv/](https://entryscape.com/sv/).
EntryScape Registry är en lösning för att hantera ett register över datakataloger och relaterad information.

### Innehålls-backend.
Utvecklarportalen hämtar innehåll via Apollo Gateway. Sätts via env.

### Komponentbibliotek
Projektet har ett beroende till [Diggs komponentbibliotek](https://github.com/DIGGSweden/react-component-library).
Detta paket finns publicerat på NPM under [`@digg/design-system`](https://www.npmjs.com/package/@digg/design-system)

### Videos
Visning av videofilmer görs via videospelaren [screen9](https://screen9.com/). För att kunna visa filmer krävs ett konto hos screen9 och en API-nyckel.
