import type {
  ChoiceFragment,
  FormElementFragment,
} from "@/graphql/gql/graphql";

type FormElementByType<TTypename extends FormElementFragment["__typename"]> =
  Extract<FormElementFragment, { __typename: TTypename }>;

interface DefaultProps {
  value: string;
  number: number;
}

interface FormText
  extends FormElementByType<"dataportal_Digg_FormText">,
    DefaultProps {
  ID: number;
  __typename: "dataportal_Digg_FormText";
}

interface TextArea
  extends FormElementByType<"dataportal_Digg_FormTextArea">,
    DefaultProps {
  ID: number;
  __typename: "dataportal_Digg_FormTextArea";
  title: string;
  images: { [key: string]: string };
}

interface FormRadio
  extends FormElementByType<"dataportal_Digg_FormRadio">,
    DefaultProps {
  ID: number;
  selected: FormChoice | null;
  choices: FormChoice[];
  exploratory: boolean;
  __typename: "dataportal_Digg_FormRadio";
}

interface Description
  extends FormElementByType<"dataportal_Digg_FormDescription"> {
  ID: number;
  TopHeading?: boolean;
  __typename: "dataportal_Digg_FormDescription";
}

interface PageBreak extends FormElementByType<"dataportal_Digg_FormPageBreak"> {
  ID: number;
  __typename: "dataportal_Digg_FormPageBreak";
}

interface SelectedFormChoice extends ChoiceFragment {
  ID: number;
  title: string;
  popup: string | null;
  value: string | null;
  exploratory: boolean;
  __typename: "dataportal_Digg_FormChoice";
}

interface FormChoice extends ChoiceFragment {
  ID: number;
  title: string;
  popup: string | null;
  value: string | null;
  number: number;
  exploratory: boolean;
  selected: SelectedFormChoice | null;
  __typename: "dataportal_Digg_FormChoice";
}

interface FormDropdown
  extends FormElementByType<"dataportal_Digg_FormDropdown">,
    DefaultProps {
  items: FormChoice[];
  ID: number;
  selected: FormChoice | null;
  __typename: "dataportal_Digg_FormDropdown";
}

interface FormCheckbox
  extends FormElementByType<"dataportal_Digg_FormCheckbox">,
    DefaultProps {
  ID: number;
  selected: FormChoice[] | null;
  choices: FormChoice[];
  title: string;
  __typename: "dataportal_Digg_FormCheckbox";
}

interface OrganisationNumber extends DefaultProps {
  ID: number;
  title: string;
  __typename: "organisationNumber";
}

export type FormTypes =
  | FormText
  | TextArea
  | FormRadio
  | Description
  | PageBreak
  | FormChoice
  | FormDropdown
  | FormCheckbox
  | OrganisationNumber;
