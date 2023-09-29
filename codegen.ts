
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.APOLLO_URL,
  documents: ["./graphql/*.ts"],
  generates: {
    "graphql/__generated__/types.ts": {
      plugins: ['typescript'],
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        declarationKind: 'interface',
        arrayInputCoercion: false,
      }
    },
    'graphql/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.tsx',
        baseTypesPath: 'types.ts',
        folder: '__generated__'
      },
      plugins: ['typescript-operations'],
      config: { withHooks: true },
    },
    "graphql/schema.json": {
      plugins: ["introspection"],
      config: {
        schemaDescription: true
      }
    },
  }
};

export default config;
