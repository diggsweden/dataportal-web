import { FC, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { BlockList } from "@/components/content/blocks/BlockList";
import { Button, ButtonLink } from "@/components/global/Button";
import { FormTypes } from "@/types/form";
import { GeneratePDF } from "@/utilities/formUtils";
import { Heading } from "@/components/global/Typography/Heading";
import ArrowIcon from "@/assets/icons/arrowRight.svg";

type Props = {
  formDataArray: FormTypes[][];
  blocks: ModuleDataFragment["blocks"] | null;
};

export const FormGeneratePDF: FC<Props> = ({ formDataArray, blocks }) => {
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const finishedModalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  return (
    <>
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

      <div
        ref={finishedModalRef}
        className={`absolute left-1/2 top-1/2 z-50 !mt-none -translate-x-1/2 
        -translate-y-full bg-white p-xl shadow-2xl ${
          showModal ? "visible" : "hidden"
        }`}
      >
        <Heading level={3} size="sm">
          {t("pages|form$form-continue-text")}
        </Heading>

        <div className="flex justify-between">
          <Button
            variant={"secondary"}
            onClick={() => setShowModal(false)}
            label={t("common|no")}
            className="hover:bg-brown-200"
          />
          <ButtonLink
            href="/offentligai/fortroendemodellen/success"
            label={t("common|yes")}
            icon={ArrowIcon}
            iconPosition="right"
            onClick={() => setShowModal(false)}
          />
        </div>
      </div>

      {/* This is to set a background color behind the open modal */}
      <div
        className={`absolute left-none top-none z-40 !mt-none h-full w-full bg-brownOpaque5 ${
          showModal ? "visible" : "hidden"
        }`}
      />

      {/* Hidden iframe used only for printing */}
      <iframe
        className="hidden"
        ref={iframeRef}
        title="frame"
        id="printFrame"
        srcDoc="<div>Empty</div>"
      ></iframe>
    </>
  );
};
