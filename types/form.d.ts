import {
  FormElement_Dataportal_Digg_FormRadio_Fragment,
  FormElement_Dataportal_Digg_FormDescription_Fragment,
  ChoiceFragment,
  FormElement_Dataportal_Digg_FormPageBreak_Fragment,
  FormElement_Dataportal_Digg_FormText_Fragment,
  FormElement_Dataportal_Digg_FormTextArea_Fragment,
  FormElement_Dataportal_Digg_FormDropdown_Fragment,
} from "@/graphql/__generated__/operations";

interface DefaultProps {
  value: string;
  number: number;
}

interface FormText
  extends FormElement_Dataportal_Digg_FormText_Fragment,
    DefaultProps {
  ID: number;
  __typename: "dataportal_Digg_FormText";
}

interface TextArea
  extends FormElement_Dataportal_Digg_FormTextArea_Fragment,
    DefaultProps {
  ID: number;
  __typename: "dataportal_Digg_FormTextArea";
  title: string;
  images: { [key: string]: string };
}

interface FormRadio
  extends FormElement_Dataportal_Digg_FormRadio_Fragment,
    DefaultProps {
  ID: number;
  selected: FormChoice | null;
  choices: FormChoice[];
  exploratory: boolean;
  __typename: "dataportal_Digg_FormRadio";
}

interface Description
  extends FormElement_Dataportal_Digg_FormDescription_Fragment {
  ID: number;
  TopHeading?: boolean;
  __typename: "dataportal_Digg_FormDescription";
}

interface PageBreak extends FormElement_Dataportal_Digg_FormPageBreak_Fragment {
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
  extends FormElement_Dataportal_Digg_FormDropdown_Fragment,
    DefaultProps {
  items: FormChoice[];
  ID: number;
  selected: FormChoice | null;
  __typename: "dataportal_Digg_FormDropdown";
}

interface FormCheckbox
  extends FormElement_Dataportal_Digg_FormCheckbox_Fragment,
    DefaultProps {
  ID: number;
  selected: FormChoice[] | null;
  choices: FormChoice[];
  title: string;
  __typename: "dataportal_Digg_FormCheckbox";
}

interface OrganisationNumber
  extends FormElement_Dataportal_Digg_FormOrganisationNumber_Fragment,
    DefaultProps {
  ID: number;
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
