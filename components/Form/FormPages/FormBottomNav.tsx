import { Button, ArrowIcon, css } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import FormTypes from "../FormTypes";
import { FormNavButtons, DiggConfirmModal } from "../Styles/FormStyles";
import {
  handleScroll,
  GenerateJsonFile,
  ImportFromJsonFile,
} from "../Utils/formUtils";

type Props = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  formDataArray: FormTypes[][];
  setFormDataArray: React.Dispatch<React.SetStateAction<FormTypes[][]>>;
  scrollRef: React.RefObject<HTMLSpanElement>;
};

const FormBottomNav: React.FC<Props> = ({
  setPage,
  page,
  formDataArray,
  setFormDataArray,
  scrollRef,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {t} = useTranslation();
  const { asPath } = useRouter();

  const clearForm = () => {
    //Clear the "Value" field on all objects that has the Value field.
    let tmpArr = formDataArray.map((item) => {
      item.forEach((data) => {
        if ("value" in data) {
          data.value = "";
        }
        if ("choices" in data) {
          data.selected = data.choices[data.choices.length - 1];
          data.value = "";
        }
      });
      return item;
    });

    setFormDataArray(tmpArr);
    localStorage.removeItem(`${asPath}Data`);
  };

  return (
    <>
      <FormNavButtons>
        <Button
          primary
          onClick={() => {
            setPage(page + 1);
            handleScroll(scrollRef);
          }}
        >
          <span>
          {t('pages|form$next-section-text')}
            <ArrowIcon className="nav-icon" width={"18px"} />
          </span>
        </Button>
        <span>
          <Button
            css={css`
              font-weight: 500;
            `}
            onClick={(e) => {
              e.preventDefault();
              GenerateJsonFile(formDataArray);
            }}
          >
            {t('pages|form$save-form')}
          </Button>
          <input
            type="file"
            accept="application/json"
            title="Ladda upp JSON"
            ref={fileInputRef}
            onChange={(e) => {
              ImportFromJsonFile(e, formDataArray, setFormDataArray);
            }}
            css={css`
              display: none;
            `}
          />
          <Button
            css={css`
              font-weight: 500;
            `}
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            {t('pages|form$upload-json-file')}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              modalRef.current?.classList.remove("hide");
            }}
            css={css`
              font-weight: 500;
            `}
          >
            {t('pages|form$clear-all-text')}
          </Button>
          
          <DiggConfirmModal ref={modalRef} className="hide">
            <div className="modal-content">
              <p>{t('pages|form$clear-confirm-text')}</p>
              <div className="modal-buttons">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearForm();
                    modalRef.current?.classList.add("hide");
                  }}
                >
                  {t('common|yes')}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    modalRef.current?.classList.add("hide");
                  }}
                >
                  {t('common|no')}
                </button>
              </div>
            </div>
          </DiggConfirmModal>
        </span>
      </FormNavButtons>
    </>
  );
};

export default FormBottomNav;
