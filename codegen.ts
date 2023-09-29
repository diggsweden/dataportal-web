
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.APOLLO_URL,
  documents: ["./graphql/*.ts"],
  generates: {
    "./graphql/__generated__/types.ts": {
      plugins: ["typescript"],
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        declarationKind: 'interface',
        arrayInputCoercion: false,
      }
    },
    "./graphql/schema.json": {
      plugins: ["introspection"]
    },
  }
};

export default config;
