import { css, Heading } from '@digg/design-system';
import React from 'react';
import FormTypes from '../FormTypes';
import {
  DiggPopover,
  DiggRadio,
  DiggRadioLabel,
  DiggRadioWrapper,
  DiggTextWithLink,
  FormTextArea,
  Text,
} from '../Styles/FormStyles';

const PopOver = (popoverText: string) => {
  return (
    <DiggPopover className="text-md">
      <div
        aria-haspopup="true"
        onClick={(e) => {
          if (e.currentTarget.classList.contains('open')) {
            e.currentTarget.classList.remove('open');
            e.currentTarget.setAttribute('aria-haspopup', 'false');
          } else {
            e.currentTarget.classList.add('open');
            e.currentTarget.setAttribute('aria-haspopup', 'true');
          }
        }}
        css={css`
          p {
            margin-top: 2rem !important;
          }
        `}
      >
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: popoverText }}
        ></p>
      </div>
    </DiggPopover>
  );
};

const AddLabel = (number: number, Type: string, ID: number, title: string) => {
  return (
    <>
      <span
        css={css`
          position: relative;
          display: flex;
          flex-direction: row;
          margin-bottom: 0;
        `}
        className="text-md"
      >
        {`${number === -1 ? 'Old:' : number + '.'} `}
        <div
          css={css`
            display: flex;
            align-items: flex-start;

            label {
              margin-right: 1rem;
            }
          `}
        >
          <label
            className="text-md"
            htmlFor={`${Type}${ID}`}
            dangerouslySetInnerHTML={{ __html: title }}
          ></label>
        </div>
      </span>
    </>
  );
};

const RenderDivider = () => {
  return (
    <div
      css={css`
        border-top: 1px solid #757575;
        margin-bottom: 2rem;
      `}
    ></div>
  );
};

interface Props {
  UpdateFormDataArray: (e: React.ChangeEvent<any>, data: FormTypes, pageIndex: number) => void;
  formDataArray: Array<FormTypes>;
  pageIndex: number;
}

const FormItem = (
  item: FormTypes,
  UpdateFormDataArray: (e: React.ChangeEvent<any>, data: FormTypes, pageIndex: number) => void,
  pageIndex: number
) => {
  const { ID, __typename: Type } = item;

  switch (Type) {
    case 'dataportal_Digg_FormText':
      return (
        <>
          {AddLabel(item.number, Type, ID, item.title)}
          {item.info !== null && PopOver(item.info)}
          <Text
            id={`${Type}${ID}`}
            placeholder="Fyll i ditt svar"
            name={`${Type}${ID}`}
            value={item.value}
            className="text-md"
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
          />
          {RenderDivider()}
        </>
      );
    case 'dataportal_Digg_FormTextArea':
      return (
        <>
          {AddLabel(item.number, Type, ID, item.title)}
          {item.info !== null && PopOver(item.info)}
          <FormTextArea
            name={`${Type}${ID}`}
            id={`${Type}${ID}`}
            placeholder="Fyll i ditt svar"
            value={item.value}
            className="text-md"
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
          />
          {RenderDivider()}
        </>
      );
    case 'dataportal_Digg_FormRadio':
      return (
        <>
          <fieldset>
            <span
              css={css`
                display: flex;
                flex-direction: row;
                margin-bottom: 0;
              `}
              className="text-md"
            >
              {`${item.number === -1 ? 'Old:' : item.number + '.'} `}
              <legend className="text-md">{item.title}</legend>
            </span>

            {item.info !== null && (
              <div
                css={css`
                  margin-bottom: 1rem;
                `}
              >
                {PopOver(item.info)}
              </div>
            )}

            <DiggRadioWrapper
              aria-expanded={
                item.selected !== item.choices[item.choices.length - 1] &&
                item.selected.popup &&
                item.selected.popup.length > 0
                  ? "true"
                  : false
              }
            >
              {item.choices.map((choice) => {
                return (
                  <DiggRadioLabel key={choice.ID}>
                    <DiggRadio
                      type="radio"
                      name={`${Type}${ID}`}
                      checked={item.selected.ID === choice.ID}
                      value={choice.label}
                      onChange={(e) => {
                        UpdateFormDataArray(e, choice, pageIndex);
                      }}
                    />
                    <span>{choice.label}</span>
                  </DiggRadioLabel>
                );
              })}
            </DiggRadioWrapper>
          </fieldset>

          {item.selected.popup && item.selected.popup.length > 0 ? (
            <>
              <label className="popup-label" htmlFor={`${Type}${ID}`}>
                {item.selected.popup && (
                  <DiggTextWithLink
                    css={css`
                      margin-bottom: 0;
                    `}
                    className="text-md"
                    dangerouslySetInnerHTML={{ __html: item.selected.popup }}
                  ></DiggTextWithLink>
                )}
              </label>

              <FormTextArea
                id={`${Type}${ID}`}
                name={`${Type}${ID}`}
                placeholder="Fyll i ditt svar"
                value={item.value}
                className="text-md"
                onChange={(e) => {
                  UpdateFormDataArray(e, item, pageIndex);
                }}
              />
            </>
          ) : (
            <span
              css={css`
                margin-bottom: 3rem;
              `}
            />
          )}
          {RenderDivider()}
        </>
      );
    case 'dataportal_Digg_FormDescription':
      return (
        <>
          <Heading level={item.TopHeading === true ? 2 : 3}>{item.title}</Heading>
          {item.text.length > 1 && (
            <p
              css={css`
                margin-top: 0;
                margin-bottom: 3rem;
              `}
            >
              {item.text}
            </p>
          )}
        </>
      );
  }
};

const FormPage = ({ formDataArray, UpdateFormDataArray, pageIndex }: Props) => {
  return (
    <>
      {formDataArray.map((item) => {
        return (
          <React.Fragment key={`item-${item.ID}`}>
            {FormItem(item, UpdateFormDataArray, pageIndex)}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default FormPage;
