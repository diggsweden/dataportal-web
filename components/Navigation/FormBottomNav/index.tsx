import { FormTypes } from "@/types/form";
import useTranslation from "next-translate/useTranslation";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import ArrowLeftIcon from "@/assets/icons/arrowLeft.svg";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import { Button } from "@/components/global/Button";
import {
  GenerateJsonFile,
  ImportFromJsonFile,
  handleScroll,
} from "@/utilities/formUtils";

type Props = {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  formDataArray: FormTypes[][];
  setFormDataArray: Dispatch<SetStateAction<FormTypes[][]>>;
  scrollRef: RefObject<HTMLSpanElement>;
};

export const FormBottomNav: FC<Props> = ({
  setPage,
  page,
  formDataArray,
  setFormDataArray,
  scrollRef,
}) => {
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const clearModalRef = useRef<HTMLDivElement>(null);
  const saveModalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const pathname = usePathname();

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
    localStorage.removeItem(`${pathname}Data`);
  };

  return (
    <nav className="space-y-xl pt-xl">
      <div className={`flex ${page === 1 ? "justify-end" : "justify-between"}`}>
        {page > 1 && (
          <Button
            label={t("pages|form$previous-section-text")}
            icon={ArrowLeftIcon}
            iconPosition="left"
            variant={"secondary"}
            onClick={() => {
              setPage(page - 1);
              handleScroll(scrollRef);
            }}
          />
        )}
        <Button
          label={t("pages|form$next-section-text")}
          icon={ArrowRightIcon}
          iconPosition="right"
          onClick={() => {
            setPage(page + 1);
            handleScroll(scrollRef);
          }}
        />
      </div>

      <div className="flex justify-between">
        <Button
          label={t("pages|form$save-form")}
          onClick={() => setSaveModalOpen(true)}
        />
        <input
          type="file"
          accept="application/json"
          title="Ladda upp JSON"
          ref={fileInputRef}
          onChange={(e) => {
            ImportFromJsonFile(e, formDataArray, setFormDataArray);
          }}
          className="hidden"
        />
        <Button
          label={t("pages|form$upload-json-file")}
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
        />
        <Button
          label={t("pages|form$clear-all-text")}
          onClick={() => setClearModalOpen(true)}
        />
      </div>

      <div
        className={`absolute left-none top-none z-40 !mt-none h-full w-full bg-brownOpaque5 ${
          saveModalOpen || clearModalOpen ? "visible" : "hidden"
        }`}
        onClick={() => {
          setSaveModalOpen(false);
          setClearModalOpen(false);
        }}
      />

      <div
        ref={clearModalRef}
        className={`fixed left-1/2 top-1/2 z-50 !mt-none -translate-x-1/2 
        -translate-y-full bg-white p-xl shadow-2xl ${
          clearModalOpen ? "visible" : "hidden"
        }`}
        onClick={(e) => {
          if (e.currentTarget !== e.target) {
            setClearModalOpen(false);
          }
        }}
      >
        <p>{t("pages|form$clear-confirm-text")}</p>
        <div className="modal-buttons">
          <button
            onClick={(e) => {
              e.preventDefault();
              clearModalRef.current?.classList.add("hide");
            }}
          >
            Avbryt
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              clearForm();
              clearModalRef.current?.classList.add("hide");
            }}
          >
            Ja
          </button>
        </div>
      </div>

      <div
        ref={saveModalRef}
        className={`fixed left-1/2 top-1/2 z-50 !mt-none -translate-x-1/2 
        -translate-y-full bg-white p-xl shadow-2xl ${
          saveModalOpen ? "visible" : "hidden"
        }`}
        onClick={(e) => {
          if (e.currentTarget !== e.target) {
            setSaveModalOpen(false);
          }
        }}
      >
        <p>
          När du klickar på OK så kommer en JSON-fil att genereras och laddas
          ner.
          <br />
          <br />
          Läs i Guiden till förtroendemoellen på förstasidan om hur du använder
          JSON-filen.
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
    </nav>
  );
};
