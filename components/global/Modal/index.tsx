import { FC, useRef } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { Button, ButtonLink } from "@/components/global/Button";
import ArrowIcon from "@/assets/icons/arrowRight.svg";
import { HtmlParser } from "../Typography/HtmlParser";
import { isExternalLink } from "@/utilities";
import ExternalIcon from "@/assets/icons/external-link.svg";

interface ModalProps {
  heading: string;
  text?: string;
  onClick?: () => void;
  modalOpen: boolean;
  setModalOpen: Function;
  closeBtn: string;
  confirmBtn: string;
  description?: string | null;
  href?: string;
  type?: "tools";
}

export const Modal: FC<ModalProps> = ({
  heading,
  text,
  onClick,
  modalOpen,
  setModalOpen,
  description,
  closeBtn,
  confirmBtn,
  href,
  type,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const modalType = type === "tools";
  return (
    <>
      <div
        className={`fixed bottom-none left-none right-none top-none z-40 overflow-hidden bg-brownOpaque5 
        ${modalOpen ? "visible" : "hidden"}`}
        onClick={() => setModalOpen(false)}
      />
      <div
        ref={ref}
        className={`fixed left-1/2 top-1/2 z-50 !mt-none max-h-[60vh] w-4/5 max-w-md -translate-x-1/2 -translate-y-1/2  
        overflow-auto bg-white p-xl shadow-2xl md:w-auto ${
          modalOpen ? "visible" : "hidden"
        }`}
        onClick={(e) => {
          if (e.currentTarget !== e.target) {
            setModalOpen(false);
          }
        }}
      >
        {heading && (
          <Heading
            level={3}
            size={modalType ? "md" : "sm"}
            className={text ? "font-thin" : "pb-lg"}
          >
            {heading}
          </Heading>
        )}
        {text && (
          <p
            className={`${
              modalType ? "pt-lg text-lg text-brown-600" : ""
            } pb-lg`}
          >
            {text}
          </p>
        )}
        {description && (
          <div className="pb-lg">{HtmlParser({ text: description })}</div>
        )}

        <div className="flex justify-between gap-lg">
          <Button
            onClick={() => setModalOpen(false)}
            className="min-w-[50px] justify-center hover:bg-brown-200"
            variant={"secondary"}
            label={closeBtn}
          />
          {href ? (
            <ButtonLink
              href={href}
              onClick={onClick}
              label={confirmBtn}
              icon={!isExternalLink(href) ? ArrowIcon : ExternalIcon}
              iconPosition="right"
              className="min-w-[50px] justify-center"
            />
          ) : (
            <Button
              onClick={onClick}
              label={confirmBtn}
              className="min-w-[50px] justify-center"
            />
          )}
        </div>
      </div>
    </>
  );
};
