import { Button, css, Heading } from '@digg/design-system';
import React from 'react';
import FormTypes, { EventType }  from '../FormTypes';
import { DiggRadio, DiggRadioLabel, DiggRadioWrapper, DiggTextWithLink, FormTextArea, Text } from '../Styles/FormStyles';

interface Props {
  UpdateFormDataArray: (
    e: EventType,
    data: FormTypes,
    pageIndex: number
  ) => void;
  formDataArray: Array<FormTypes>;
  pageIndex: number;
}

const FormItem = (
  item: FormTypes,
  UpdateFormDataArray: (
    e: EventType,
    data: FormTypes,
    pageIndex: number
  ) => void,
  pageIndex: number
) => {
  const { ID, Type } = item;

  switch (Type) {
    case 'Text':
      return (
        <>
          <label
            className="text-base"
            htmlFor={`${Type}${ID}`}
          >
            {item.Header}
          </label>
          <Text
            id={`${Type}${ID}`}
            placeholder="Fyll i ditt svar"
            name={`${Type}${ID}`}
            value={item.Value}
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
          />
        </>
      );
    case 'TextArea':
      return (
        <>
          <label
            className="text-base"
            htmlFor={`${Type}${ID}`}
            dangerouslySetInnerHTML={{ __html: item.Header }}
          >
          </label>
          <FormTextArea
            name={`${Type}${ID}`}
            id={`${Type}${ID}`}
            placeholder="Fyll i ditt svar"
            value={item.Value}
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
          />
        </>
      );
    case 'TextChoice':
      return (
        <>
        <fieldset>
        <legend
            className="text-base" 
          >
            {item.Header}
          </legend>

          <DiggRadioWrapper>
            <DiggRadioLabel>            
              <DiggRadio
                type="radio"
                name={`${Type}${ID}`}
                checked={item.Choice === 'Yes'}
                onChange={() => UpdateFormDataArray('Yes', item, pageIndex)}
              /> 
              <span className="text-base">Ja</span>             
            </DiggRadioLabel>
            <DiggRadioLabel>            
              <DiggRadio
                type="radio"
                name={`${Type}${ID}`}
                checked={item.Choice === 'No'}
                onChange={() => UpdateFormDataArray('No', item, pageIndex)}
              />    
              <span className="text-base">Nej</span>          
            </DiggRadioLabel>
            <DiggRadioLabel>            
              <DiggRadio
                type="radio"
                name={`${Type}${ID}`}
                checked={item.Choice === 'NA'}
                onChange={() => UpdateFormDataArray('NA', item, pageIndex)}
              />    
              <span className="text-base">Inget svar</span>          
            </DiggRadioLabel>
          </DiggRadioWrapper>
        </fieldset>         

          {item.Choice === 'Yes' && (
            <>
              <label htmlFor={`${Type}${ID}`}>{item.YesText && <DiggTextWithLink className='text-base' dangerouslySetInnerHTML={{__html: item.YesText}}></DiggTextWithLink>}</label>
              <FormTextArea
                id={`${Type}${ID}`}
                name={`${Type}${ID}`}
                placeholder="Fyll i ditt svar"
                value={item.Value}
                onChange={(e) => {
                  UpdateFormDataArray(e, item, pageIndex);
                }}
              />
            </>
          )}

          {item.Choice === 'No' && item.NoText && item.NoText.length > 0 ? (
            <>
              <label htmlFor={`${Type}${ID}`}>{item.NoText && <DiggTextWithLink className='text-base' dangerouslySetInnerHTML={{__html: item.NoText}}></DiggTextWithLink>}</label>
              {/* If "No" should also need an answer, we can juse uncomment this. If SOME questions need an answer on "NO" then we need an extra check. */}
              <FormTextArea
                id={`${Type}${ID}`}
                name={`${Type}${ID}`}
                placeholder="Fyll i ditt svar"
                value={item.Value}
                onChange={(e) => {
                  UpdateFormDataArray(e, item, pageIndex);
                }}
              />
            </>
          ) : 
          (<span css={css`margin-bottom: 1rem;`}/>)}
        </>
      );
    case 'Description':
      return (
        <>
          <Heading level={item.TopHeading ? 2 : 3}>{item.Header}</Heading>
          {item.Description.length > 1 && <p>{item.Description}</p>}
        </>
      );
  }
};

const FormPage = ({ formDataArray, UpdateFormDataArray, pageIndex }: Props) => {
  return (
    <>
      {formDataArray.map((item) => {
        return <React.Fragment key={`item-${item.ID}`}>
            {FormItem(item, UpdateFormDataArray, pageIndex)}
          </React.Fragment>;
      })}
    </>
  );
};

export default FormPage;
