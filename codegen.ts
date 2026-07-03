import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.APOLLO_URL,
  documents: [
    "./src/graphql/**/*.ts",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/utilities/**/*.ts",
    "./src/providers/**/*.{ts,tsx}",
    "!./src/graphql/gql/**",
  ],
  generates: {
    "src/graphql/gql/": {
      preset: "client",
      config: {
        avoidOptionals: {
          field: true,
        },
        nonOptionalTypename: true,
        arrayInputCoercion: false,
        useTypeImports: true,
      },
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragmentData",
        },
      },
    },
    "src/graphql/schema.json": {
      plugins: ["introspection"],
      config: {
        schemaDescription: true,
      },
    },
  },
};

export default config;
