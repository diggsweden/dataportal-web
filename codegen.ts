import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.APOLLO_URL,
  documents: ["./graphql/*.ts"],
  generates: {
    "graphql/__generated__/types.ts": {
      plugins: [
        {
          add: {
            content:
              "/** THIS FILE IS AUTO-GENERATED **/\n" +
              "/** DO NOT EDIT **/\n" +
              "/* eslint-disable */",
          },
        },
        "typescript",
      ],
      config: {
        avoidOptionals: {
          field: true,
        },
        nonOptionalTypename: true,
        declarationKind: "interface",
        onlyOperationTypes: true,
      },
    },
    "graphql/__generated__/operations.ts": {
      preset: "import-types",
      plugins: [
        {
          add: {
            content:
              "/** THIS FILE IS AUTO-GENERATED **/\n" +
              "/** DO NOT EDIT **/\n" +
              "/* eslint-disable */",
          },
        },
        "typescript-operations",
      ],
      presetConfig: {
        typesPath: "./types",
      },
      config: {
        avoidOptionals: {
          field: true,
        },
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        declarationKind: "interface",
        arrayInputCoercion: false,
        onlyOperationTypes: true,
        // omitOperationSuffix: true,
        exportFragmentSpreadSubTypes: true,
      },
    },
    "graphql/schema.json": {
      plugins: ["introspection"],
      config: {
        schemaDescription: true,
      },
    },
  },
};

export default config;
