import { FC, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { BlockList } from "@/components/content/blocks/BlockList";
import { Button } from "@/components/global/Button";
import { FormTypes } from "@/types/form";
import { GeneratePDF } from "@/utilities/formUtils";

import { Modal } from "../../Modal";

type Props = {
  formDataArray: FormTypes[][];
  blocks: ModuleDataFragment["blocks"] | null;
};

export const FormGeneratePDF: FC<Props> = ({ formDataArray, blocks }) => {
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  return (
    <div>
      {blocks && (
        <div className="generate-pdf-block">
          <BlockList blocks={blocks} />
        </div>
      )}

      <Button
        label={t("pages|form$generate-pdf-text")}
        onClick={(e) => {
          GeneratePDF(e, iframeRef, formDataArray);

          const url = pathname;
          const urlArray = url.split("/");
          const curPath = urlArray[urlArray.length - 1];
          const pathsToIgnore = ["uppfoljning", "infor-utveckling"];
          //Only show the modal that redirects to the success page for 'fortroendemodellen' not for 'uppfoljning' or 'infor-utveckling'
          if (!pathsToIgnore.some((path) => curPath.includes(path))) {
            setTimeout(() => {
              setShowModal(true);
            }, 500);
          }
        }}
        type="submit"
      />

      <Modal
        heading={t("pages|form$form-continue-text")}
        closeBtn={t("common|no")}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        confirmBtn={t("common|yes")}
        href={"/offentligai/fortroendemodellen/success"}
      />

      {/* Hidden iframe used only for printing */}
      <iframe
        className="hidden"
        ref={iframeRef}
        title="frame"
        id="printFrame"
        srcDoc="<div>Empty</div>"
      ></iframe>
    </div>
  );
};
