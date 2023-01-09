import { ArrowDropIcon, Heading } from "@digg/design-system";
import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { renderMarkdown } from "../../Renderers";
import FormTypes from "../FormTypes";
import {
  DiggPopover,
  DiggRadio,
  DiggRadioLabel,
  DiggRadioWrapper,
  DiggTextWithLink,
  FormTextArea,
  Text,
} from "../Styles/FormStyles";

const PopOver = (popoverText: string) => {
  return (
    <DiggPopover className="text-md">
      <div
        aria-haspopup="true"
        tabIndex={0}
        onMouseDown={(e) => {
          if (e.currentTarget.classList.contains("open")) {
            e.currentTarget.classList.remove("open");
            e.currentTarget.setAttribute("aria-haspopup", "false");
          } else {
            e.currentTarget.classList.add("open");
            e.currentTarget.setAttribute("aria-haspopup", "true");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === " ") {
            e.preventDefault();
            if (e.currentTarget.classList.contains("open")) {
              e.currentTarget.classList.remove("open");
              e.currentTarget.setAttribute("aria-haspopup", "false");
            } else {
              e.currentTarget.classList.add("open");
              e.currentTarget.setAttribute("aria-haspopup", "true");
            }
          }
        }}
      >
        <span className="show-more"><ArrowDropIcon color={'white'} /></span>
        <p
          onMouseDown={(e) => {e.stopPropagation()}}
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
      <span className="text-md form-label-wrapper">
        {`${number === -1 ? "Old:" : number + "."} `}
        <div className="label-body">
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
  return <div className="form-divider"></div>;
};

interface Props {
  UpdateFormDataArray: (
    e: React.ChangeEvent<any>,
    data: FormTypes,
    pageIndex: number
  ) => void;
  formDataArray: Array<FormTypes>;
  pageIndex: number;
}

const FormItem = (
  item: FormTypes,
  UpdateFormDataArray: (
    e: React.ChangeEvent<any>,
    data: FormTypes,
    pageIndex: number
  ) => void,
  pageIndex: number,
  t: Translate,
) => {
  const { ID, __typename: Type } = item;

  switch (Type) {
    case "dataportal_Digg_FormText":
      return (
        <>
          {AddLabel(item.number, Type, ID, item.title)}
          {item.info !== null && PopOver(item.info)}
          <Text
            id={`${Type}${ID}`}
            placeholder={t("form$placeholder-text")}
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
    case "dataportal_Digg_FormTextArea":
      return (
        <>
          {AddLabel(item.number, Type, ID, item.title)}
          {item.info !== null && PopOver(item.info)}
          <FormTextArea
            name={`${Type}${ID}`}
            id={`${Type}${ID}`}
            placeholder={t("form$placeholder-text")}
            value={item.value}
            className="text-md"
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
            
            onDrop={(e) => {
              e.preventDefault();
              const curTarget = e.currentTarget;
              const file = e.dataTransfer.files[0];
              const reader = new FileReader();
              reader.readAsDataURL(file);

              reader.onload = () => {
                const base64 = reader.result;
                if (typeof base64 === "string" && base64.includes("image")) {
                  const curVal = curTarget.value;

                  const start = curTarget.selectionStart;
                  const end = curTarget.selectionEnd;
                  const newVal = curVal.substring(0, start) + `[[${file.name}]]((${base64}))` + curVal.substring(end);

                  curTarget.value = newVal;
                  UpdateFormDataArray(e, item, pageIndex);

                  setTimeout(() => { 
                    curTarget.value = curVal.substring(0, start) + `[${file.name}]` + curVal.substring(end);
                    UpdateFormDataArray(e, item, pageIndex);
                  }, 5);
                }
              };
            }}

            onDragOver={(e) => {
              e.preventDefault();
            }}
          />
          {RenderDivider()}
        </>
      );
    case "dataportal_Digg_FormRadio":
      return (
        <>
          <fieldset>
            <span className="text-md form-radio__heading">
              {`${item.number === -1 ? "Old:" : item.number + "."} `}
              <legend className="text-md">{item.title}</legend>
            </span>

            {item.info !== null && (
              <div className="form-radio__popover">{PopOver(item.info)}</div>
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
                    <span>{choice.label}{choice.popup ? '*' : ''}</span>
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
                    className="text-md"
                    dangerouslySetInnerHTML={{ __html: item.selected.popup }}
                  ></DiggTextWithLink>
                )}
              </label>

              <FormTextArea
                id={`${Type}${ID}`}
                name={`${Type}${ID}`}
                placeholder={t("form$placeholder-text")}
                value={item.value}
                className="text-md"
                onChange={(e) => {
                  UpdateFormDataArray(e, item, pageIndex);
                }}
              />
            </>
          ) : (
            <span className="form-radio__mb" />
          )}
          {RenderDivider()}
        </>
      );
    case "dataportal_Digg_FormDescription":
      return (
        <>
          <Heading level={item.TopHeading === true ? 2 : 3}>
            {item.title}
          </Heading>
          {item.text.markdown?.length && item.text.markdown?.length > 1 && (
            <p className="form-description__text">{renderMarkdown(item.text.markdown || '')}</p>
          )}
        </>
      );
  }
};

const FormPage = ({ formDataArray, UpdateFormDataArray, pageIndex }: Props) => {
  const {t} = useTranslation('pages');
  return (
    <>
      {formDataArray.map((item) => {
        return (
          <React.Fragment key={`item-${item.ID}`}>
            {FormItem(item, UpdateFormDataArray, pageIndex, t)}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default FormPage;
