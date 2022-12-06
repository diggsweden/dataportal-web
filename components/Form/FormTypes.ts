 type FormText = {
  ID: number;
  Type: 'Text';
  Value: string;
  Header: string;
};

 type TextArea = {
  ID: number;
  Type: 'TextArea';
  Value: string;
  Header: string;
};

 type TextChoice = {
  ID: number;
  Type: 'TextChoice';
  Value: string;
  Header: string;
  Choice: RadioChoice;
  YesText?: string;
  NoText?: string;
};

 type Description = {
  ID: number;
  Type: 'Description';
  Header: string;
  Description: string;
  TopHeading?: boolean;
};

 type PageBreak = {
  ID: number;
  Type: 'PageBreak';
  Title: string;
};

export type EventType = React.ChangeEvent<any> | RadioChoice;
type RadioChoice = 'Yes' | 'No' | 'NA';

type FormTypes = FormText | TextArea | TextChoice | Description | PageBreak;
export default FormTypes;
