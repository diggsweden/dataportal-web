# Sveriges dataportal webbklient

Här finns källkoden för dataportalens webbklient
[https://www.dataportal.se](https://www.dataportal.se)

## Förutsättningar

- node 10.19.0
- yarn

## EntryScape

Den svenska dataportalen är starkt integrerad med produktsviten EntryScape från MetaSolutions AB, https://entryscape.com/sv/.
EntryScape Registry är en lösning för att hantera ett register över datakataloger och relaterad information.

## Federerat innehåll

Den svenska dataportalen konsumerar nyheter och innehållssidor via en GraphQL proxy, 
som presenteras med hjälp av Apollo GraphQL och React. GraphQL-proxyn är för tillfället 
inte publicerad på Github. 

## Utveckling

```sh
yarn
yarn start
```

Gå till [http://localhost:8080](http://localhost:8080) i din webbläsare.

## Lokal server

För att testa applikationen via en node express-server kör följande:

```sh
yarn
yarn build
yarn localserver
```

Besök [http://localhost:3003](http://localhost:3003) i din webbläsare.

## Produktionsbygge

Bygg för produktion genom att köra följande:

```
yarn build
```

Detta kommer generera applikationen som statiska filer i dist-mappen. `dist/server` för server och `dist/client` för klient.

## Stack

- [TypeScript](https://www.typescriptlang.org/) typad JS
- [React](https://reactjs.org/) för UI
- [Emotion](https://emotion.sh) för styling
- [React Router](https://reacttraining.com/react-router/) för routing
- [Apollo GraphQL](https://www.apollographql.com/) för federerat innehåll


## Noteringar

Projektet har ett beroende till Diggs designsystemspaket `@digg/design-system`. 
I skrivande stund är källkoden till detta paket inte publicerad på Github eller NPM.