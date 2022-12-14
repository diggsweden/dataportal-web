import {
  Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio,
  Form_dataportal_Digg_Form_elements_dataportal_Digg_FormDescription,
  Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio_choices,
  Form_dataportal_Digg_Form_elements_dataportal_Digg_FormPageBreak,
  Form_dataportal_Digg_Form_elements_dataportal_Digg_FormText,
} from '../../graphql/__generated__/Form';

export interface DefaultProps {
  value: string;
  number: number;
}

interface FormText
  extends Form_dataportal_Digg_Form_elements_dataportal_Digg_FormText,
    DefaultProps {
  ID: number;
  __typename: 'dataportal_Digg_FormText';
}

interface TextArea
  extends Form_dataportal_Digg_Form_elements_dataportal_Digg_FormText,
    DefaultProps {
  ID: number;
  __typename: 'dataportal_Digg_FormTextArea';
  title: string;
}

interface FormRadio
  extends Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio,
    DefaultProps {
  ID: number;
  selected: FormChoice;
  choices: FormChoice[];
}

interface Description extends Form_dataportal_Digg_Form_elements_dataportal_Digg_FormDescription {
  ID: number;
  TopHeading?: boolean;
}

interface PageBreak extends Form_dataportal_Digg_Form_elements_dataportal_Digg_FormPageBreak {
  ID: number;
  __typename: 'dataportal_Digg_FormPageBreak';
}

interface FormChoice extends Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio_choices {
  ID: number;
}

type FormTypes = FormText | TextArea | FormRadio | Description | PageBreak | FormChoice;
export default FormTypes;
