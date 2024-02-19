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
import { Modal } from "@/components/global/Modal";

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
    <nav className="z-40 space-y-lg pt-xl md:space-y-xl">
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

      <div className="flex flex-col gap-md md:flex-row md:justify-between">
        <Button
          label={t("pages|form$save-form")}
          onClick={() => setSaveModalOpen(true)}
          className="button--large w-full justify-center md:w-auto md:justify-start"
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
          className="button--large w-full justify-center md:w-auto md:justify-start"
        />
        <Button
          label={t("pages|form$clear-all-text")}
          onClick={() => setClearModalOpen(true)}
          className="button--large w-full justify-center md:w-auto md:justify-start"
        />
      </div>

      <Modal
        heading={t("pages|form$clear-confirm-text")}
        onClick={clearForm}
        modalOpen={clearModalOpen}
        setModalOpen={setClearModalOpen}
        closeBtn={"Avbryt"}
        confirmBtn={t("common|yes")}
      />

      <Modal
        heading={` När du klickar på OK så kommer en JSON-fil att genereras och laddas
          ner.`}
        text={`Läs i Guiden till förtroendemoellen på förstasidan om hur du använder
          JSON-filen.`}
        onClick={() => GenerateJsonFile(formDataArray)}
        modalOpen={saveModalOpen}
        setModalOpen={setSaveModalOpen}
        closeBtn={"Avbryt"}
        confirmBtn={"OK"}
      />
    </nav>
  );
};
