import {
  FormElement_Dataportal_Digg_FormRadio_Fragment,
  FormElement_Dataportal_Digg_FormDescription_Fragment,
  ChoiceFragment,
  FormElement_Dataportal_Digg_FormPageBreak_Fragment,
  FormElement_Dataportal_Digg_FormText_Fragment,
  FormElement_Dataportal_Digg_FormTextArea_Fragment,
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
  selected: FormChoice;
  choices: FormChoice[];
}

interface Description
  extends FormElement_Dataportal_Digg_FormDescription_Fragment {
  ID: number;
  TopHeading?: boolean;
}

interface PageBreak extends FormElement_Dataportal_Digg_FormPageBreak_Fragment {
  ID: number;
  __typename: "dataportal_Digg_FormPageBreak";
}

interface FormChoice extends ChoiceFragment {
  ID: number;
}

export type FormTypes =
  | FormText
  | TextArea
  | FormRadio
  | Description
  | PageBreak
  | FormChoice;
