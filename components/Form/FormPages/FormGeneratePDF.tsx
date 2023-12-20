import React from "react";
import { Button, css } from "@digg/design-system";
import { useRouter } from "next/router";
import { DiggConfirmModal } from "../Styles/FormStyles";
import { GeneratePDF } from "../Utils/formUtils";
import FormTypes from "../FormTypes";
import useTranslation from "next-translate/useTranslation";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import BlockList from "@/components/content/blocks/BlockList";

type Props = {
  formDataArray: FormTypes[][];
  blocks: ModuleDataFragment["blocks"] | null;
};

const FormGeneratePDF: React.FC<Props> = ({ formDataArray, blocks }) => {
  const router = useRouter();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const finishedModalRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  return (
    <>
      <>
        {blocks && (
          <div className="generate-pdf-block">
            <BlockList blocks={blocks} />
          </div>
        )}
      </>
      <Button
        primary
        onClick={(e) => {
          GeneratePDF(e, iframeRef, formDataArray);

          const url = router.asPath;
          const urlArray = url.split("/");
          const curPath = urlArray[urlArray.length - 1];
          const pathsToIgnore = ["uppfoljning", "infor-utveckling"];
          //Only show the modal that redirects to the success page for 'fortroendemodellen' not for 'uppfoljning' or 'infor-utveckling'
          if (!pathsToIgnore.some((path) => curPath.includes(path))) {
            setTimeout(() => {
              finishedModalRef.current?.classList.remove("hide");
            }, 500);
          }
        }}
        type="submit"
        className="text-base font-medium"
        css={css`
          margin: 3rem 0;
          width: fit-content;
        `}
      >
        {t("pages|form$generate-pdf-text")}
      </Button>
      <DiggConfirmModal ref={finishedModalRef} className="hide">
        <div className="modal-content">
          <p>{t("pages|form$form-continue-text")}</p>
          <div className="modal-buttons">
            <button
              onClick={(e) => {
                e.preventDefault();
                finishedModalRef.current?.classList.add("hide");
                router.push("/offentligai/fortroendemodellen/success");
              }}
            >
              {t("common|yes")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                finishedModalRef.current?.classList.add("hide");
              }}
            >
              {t("common|no")}
            </button>
          </div>
        </div>
      </DiggConfirmModal>

      {/* Hidden iframe used only for printing */}
      <iframe
        ref={iframeRef}
        title="frame"
        id="printFrame"
        srcDoc="<div>Empty</div>"
        css={css`
          display: none;
        `}
      ></iframe>
    </>
  );
};

export default FormGeneratePDF;
