import { Button, ArrowIcon, css } from "@digg/design-system";
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
    localStorage.removeItem("formData");
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
            Nästa avsnitt
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
            Spara
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
            Ladda upp JSON-fil
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              modalRef.current?.classList.remove("hide");
              setTimeout(() => {
                modalRef.current?.scrollIntoView({
                  behavior: "auto",
                  block: "center",
                  inline: "center",
                });
              }, 25);
            }}
            css={css`
              font-weight: 500;
            `}
          >
            Rensa alla svar
          </Button>
          <DiggConfirmModal ref={modalRef} className="hide">
            <div className="modal-content">
              <p>Är du säker?</p>
              <div className="modal-buttons">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearForm();
                    modalRef.current?.classList.add("hide");
                  }}
                >
                  Ja
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    modalRef.current?.classList.add("hide");
                  }}
                >
                  Nej
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
