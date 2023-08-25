![Sveriges dataportal](https://www.dataportal.se/images/svdp-favicon-64.png)
# Sveriges dataportal webbklient – [dataportal.se](https://www.dataportal.se)
På Sveriges dataportal synliggörs data från en rad olika typer av organisationer och sektorer. Här finns enbart information om datamängder, dvs. metadata. Data hämtas i sin tur via länkar för nedladdning eller efterfrågas hos respektive organisation som ansvarar för sina egna datamängder.
## Versionskrav
![node-current](https://img.shields.io/badge/node-16.13.2-green)
![npm-current](https://img.shields.io/badge/npm-8.1.2-green)
![nextjs-current](https://img.shields.io/badge/nextjs-13.0.2-green)

## EntryScape
[<img alt="Entryscape logotype" src="https://entryscape.com/wp-content/uploads/2023/01/Entryscape-by-Metasolutions-w385px-Retina-2.png" width="191" height="42">](https://entryscape.com/sv)

Den svenska dataportalen är starkt integrerad med produktsviten EntryScape från MetaSolutions AB, [https://entryscape.com/sv/](https://entryscape.com/sv/).
EntryScape Registry är en lösning för att hantera ett register över datakataloger och relaterad information.

## Utveckling.
Börja med att skapa en ```.env.local``` fil. Använd ```.env.local.example``` som mall.
(Env-variabler och tokens i .env.local.example som har en värdet "secret" är inte tillgängliga här och behöver bytas ut mot ett giltigt värde).

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

### Health check.

NextJs svarar på [http://localhost:1300/api/healthcheck?secret=[HEALTHCHECK_SECRET från env]](http://localhost:1300/api/healthcheck?secret=)
Cacheas inte, gör en request till contentbackend med startsidans fråga.

```sh
{"status":"fail"}
```

```sh
{"status":"pass"}
```

## Notes

### Stack
- [![Nextjs](https://badgen.net/badge/Nextjs/JS%20framework/blue)](https://nextjs.org/)
- [![TypeScript](https://badgen.net/badge/TypeScript/Typad%20Js/blue)](https://www.typescriptlang.org/)
- [![React](https://badgen.net/badge/React/För%20UI/blue)](https://reactjs.org/)
- [![Emotion](https://badgen.net/badge/Emotion/För%20styling/blue)](https://emotion.sh)
- [![Apollo Client](https://badgen.net/badge/Apollo%20Client/För%20datahämtning/blue)](https://www.apollographql.com/docs/react/)

### Innehålls-backend.
Utvecklarportalen hämtar innehåll via Apollo Gateway. Sätts via env.

### Komponentbibliotek
Projektet har ett beroende till [Diggs komponentbibliotek](https://github.com/DIGGSweden/react-component-library).
Detta paket finns publicerat på NPM under [`@digg/design-system`](https://www.npmjs.com/package/@digg/design-system)

### Videos
[<img alt="Screen9 logotype" src="https://screen9.com/wp-content/uploads/Screen9-logo-Black-CMYK.svg" width="150" height="30">](https://screen9.com/)

Visning av videofilmer görs via videospelaren [screen9](https://screen9.com/). För att kunna visa filmer krävs ett konto hos screen9 och en API-nyckel.
