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
  const clearModalRef = React.useRef<HTMLDivElement>(null);
  const saveModalRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
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
      <FormNavButtons className="text-md">
        <Button
          primary
          onClick={() => {
            setPage(page + 1);
            handleScroll(scrollRef);
          }}
        >
          <span>
            {t("pages|form$next-section-text")}
            <ArrowIcon className="nav-icon" width={"18px"} />
          </span>
        </Button>
        <span>
          <Button
            onClick={(e) => {
              e.preventDefault();
              saveModalRef.current?.classList.remove("hide");
            }}
          >
            {t("pages|form$save-form")}
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
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            {t("pages|form$upload-json-file")}
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              clearModalRef.current?.classList.remove("hide");
            }}
          >
            {t("pages|form$clear-all-text")}
          </Button>

          <DiggConfirmModal
            ref={clearModalRef}
            className="hide"
            onClick={(e) => {
              if (e.currentTarget != e.target) return;
              clearModalRef.current?.classList.add("hide");
            }}
          >
            <div className="modal-content">
              <p>{t("pages|form$clear-confirm-text")}</p>
              <div className="modal-buttons">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearModalRef.current?.classList.add("hide");
                  }}
                >
                  {t("common|no")}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearForm();
                    clearModalRef.current?.classList.add("hide");
                  }}
                >
                  {t("common|yes")}
                </button>
              </div>
            </div>
          </DiggConfirmModal>

          <DiggConfirmModal
            ref={saveModalRef}
            className="hide"
            onClick={(e) => {
              if (e.currentTarget != e.target) return;
              saveModalRef.current?.classList.add("hide");
            }}
          >
            <div className="modal-content save-modal">
              <p>
                När du klickar på OK så kommer en JSON-fil att genereras och
                laddas ner.
                <br />
                <br />
                Läs i Guiden till förtroendemoellen på förstasidan om hur du använder JSON-filen.
              </p>
              <div className="modal-buttons">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    saveModalRef.current?.classList.add("hide");
                  }}
                >
                  Avbryt
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    GenerateJsonFile(formDataArray);
                    saveModalRef.current?.classList.add("hide");
                  }}
                >
                  Ok
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
