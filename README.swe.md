![Sveriges dataportal](https://www.dataportal.se/images/svdp-favicon-64.png)

# Sveriges dataportal webbklient – [dataportal.se](https://www.dataportal.se)

På Sveriges dataportal synliggörs data från en rad olika typer av organisationer och sektorer. Här finns enbart information om datamängder, dvs. metadata. Data hämtas i sin tur via länkar för nedladdning eller efterfrågas hos respektive organisation som ansvarar för sina egna datamängder.

## EntryScape

[<img alt="Entryscape logotype" src="https://entryscape.com/wp-content/uploads/2023/01/Entryscape-by-Metasolutions-w385px-Retina-2.png" width="191" height="42">](https://entryscape.com/sv)

Den svenska dataportalen är starkt integrerad med produktsviten EntryScape från MetaSolutions AB, [https://entryscape.com/sv/](https://entryscape.com/sv/).
EntryScape Registry är en lösning för att hantera ett register över datakataloger och relaterad information.

## Versionskrav

![node-current](https://img.shields.io/badge/node-22-green)
![npm-current](https://img.shields.io/badge/npm-10-green)
![nextjs-current](https://img.shields.io/badge/nextjs-13-green)

## Utveckling

Börja med att skapa en `.env.local` fil. Använd `.env.local.example` som mall.
(Env-variabler och tokens i .env.local.example som har en värdet "secret" är inte tillgängliga här och behöver bytas ut mot ett giltigt värde).

### Kör applikationen i utvecklingsläge

Starta applikationen i utvecklingsläge med "hot-code"-omladdning, felrapportering m.m. Se: [Nextjs Development](https://nextjs.org/docs/app/api-reference/next-cli#development) för mer information.
Kör:

```sh
yarn
yarn dev
```

Besök [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Kör applikationen i productionsläge

Bygger applikationen i produktionsläge. Se [Nextjs production build](https://nextjs.org/docs/app/api-reference/next-cli#build) för mer info.
Och startar Next.js produktionsservern. Se [Nextjs start production](https://nextjs.org/docs/app/api-reference/next-cli#production) för mer info.
Kör:

```sh
yarn
yarn build
yarn start
```

Besök [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Starta applikationen med Docker

```sh
#build image
docker build . -t dataportal-web

# Create container
docker run -p 3000:3000 -e PORT=3000 -e HOST=http://localhost:3000 -e REACT_APP_APOLLO_URL=http://localhost:1400 -e REACT_APP_RUNTIME_ENV=prod -e IMAGE_DOMAIN=host.docker.internal -e REACT_APP_MEDIA_BASE_URL="http://host.docker.internal:1400/assets/dataportal" --add-host=host.docker.internal:host-gateway dataportal-web
```

### Lokal testning med Sandbox data

Gå till: [sandbox.localhost](http://sandbox.localhost:3000/) för att testa och utforska sidan med data från EntryScape sandboxmiljö.

### Health check

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
- [![Tailwind](https://badgen.net/badge/Tailwind/För%20styling/blue)](https://tailwindcss.com/)
- [![Apollo Client](https://badgen.net/badge/Apollo%20Client/För%20datahämtning/blue)](https://www.apollographql.com/docs/react/)

### Innehålls-backend

Sveriges dataportal hämtar nyheter och innehåll via GraphQL proxy. Innehållet visas med Apollo GraphQL och React. Proxyt är inte publicerat på Github.

### Videos

[<img alt="Screen9 logotype" src="https://screen9.com/wp-content/uploads/Screen9-logo-Black-CMYK.svg" width="150" height="30">](https://screen9.com/)

Visning av videofilmer görs via videospelaren [screen9](https://screen9.com/). För att kunna visa filmer krävs ett konto hos screen9 och en API-nyckel.

## E2E Test med Cypress

[cypress.io](https://www.cypress.io/)

Kör alla tester

```bash
yarn cypress run
```

Kör en specifik test

```bash
yarn cypress run --spec "cypress/e2e/YOUR_TEST_FILE.cy.js"
```

För att använda Cypress GUI, kör följande kommando.

```bash
yarn cypress open
```

Detta kan användas för att felsöka och visa tester i en användargränssnitt.

### Riktlinjer när man skriver tester

För att skriva tester som är lätt att underhålla, följ dessa riktlinjer:

- Använd beskrivande namn för tester
- Dela upp tester i mindre tester för att göra dem lättare att underhålla och felsöka
- Använd/lägg till data-test-id för att välja element för att undvika att använda CSS-attributer
- Lägg till kommentarer för att förklara varför en test är skriven på ett visst sätt
- Håll tester rena och läsbara
