import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { graphql } from "@/graphql/gql";
import type {
  FormDataFragment,
  ModuleDataFragment,
  SeoDataFragment,
} from "@/graphql/gql/graphql";

graphql(`
  fragment FormData on dataportal_Digg_Form {
    id
    identifier
    elements {
      ...FormElement
    }
  }
`);

const FormDocument = graphql(`
  query Form($identifier: String!, $locale: String) {
    dataportal_Digg_Form(identifier: $identifier, locale: $locale) {
      ...FormData
    }
  }
`);

const ModuleDocument = graphql(`
  query Module($identifier: String!, $locale: String) {
    dataportal_Digg_Module(identifier: $identifier, locale: $locale) {
      ...ModuleData
    }
  }
`);

export interface FormResponse extends FormDataFragment {
  type: "Form";
}

export interface ModuleResponse extends ModuleDataFragment {
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  type: "Module";
}

export interface ModuleOptions {
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
}

export const getForm = async (
  identifier: string,
  locale?: string,
): Promise<FormResponse> => {
  try {
    const data = await gqlFetch(FormDocument, {
      identifier,
      locale,
    });

    const form = data.dataportal_Digg_Form;

    return { ...form, type: "Form" } as FormResponse;
  } catch (error) {
    logGqlError(error);
    return { type: "Form" } as FormResponse;
  }
};

export const getModule = async (
  identifier: string,
  locale?: string,
  opts?: ModuleOptions,
): Promise<ModuleResponse> => {
  const { seo, basePath, heading } = opts || {};

  const emptyModule: ModuleDataFragment = {
    __typename: "dataportal_Digg_Module",
    blocks: [],
    identifier: "",
  };

  try {
    const data = await gqlFetch(ModuleDocument, { identifier, locale });

    const mod = data.dataportal_Digg_Module;

    return {
      ...mod,
      type: "Module",
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || null,
    } as ModuleResponse;
  } catch (error) {
    logGqlError(error);
    return {
      ...emptyModule,
      type: "Module",
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || null,
    } as ModuleResponse;
  }
};
