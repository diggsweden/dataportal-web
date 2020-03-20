# The Swedish dataportal web Client

This is the main repository for the dataportal.se web client.
[https://www.dataportal.se](https://www.dataportal.se)

## Prerequisites

- node 10.16.3
- yarn

## EntryScape

The Swedish data portal is tightly integrated with the EntryScape product suite from MetaSolutions AB, https://entryscape.com/en/.
EntryScape Registry is a solution for managing a registry of data catalogs and related information.

## Development

```sh
yarn
yarn start
```

Visit [http://localhost:8080](http://localhost:8080) in your browser.

## Development backend rendered

To test the site with a node express server, for backend rendering. 

```sh
yarn
yarn build
yarn localserver
```

Visit [http://localhost:3003](http://localhost:3003) in your browser.

## Production

Build for production using the command.

```
yarn build
```

This will generate static files in the dist directory. `dist/server` for the server and `dist/client` for the client.

## Technology Stack

- [TypeScript](https://www.typescriptlang.org/) for static types
- [React](https://reactjs.org/) for UI
- [Emotion](https://emotion.sh) for styling
- [React Router](https://reacttraining.com/react-router/) for routing

## Notes

This project depends on the `@digg/design-system` package. As of this writing the source code for this package is not published on Github or NPM.