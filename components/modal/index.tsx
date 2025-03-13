import { FC, useEffect, useRef, PropsWithChildren } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalIcon from "@/assets/icons/external-link.svg";
import { Button, ButtonLink } from "@/components/button";
import { Heading } from "@/components/typography/heading";
import { HtmlParser } from "@/components/typography/html-parser";
import { isExternalLink } from "@/utilities";

interface ModalProps {
  heading?: string;
  text?: string;
  onClick?: () => void;
  modalOpen: boolean;
  setModalOpen: (_param: boolean) => void;
  closeBtn?: string;
  closeBtnClassName?: string;
  confirmBtn?: string;
  description?: string | null;
  href?: string;
  modalSize?: "sm" | "md";
  textSize?: "sm" | "md";
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  heading,
  text,
  onClick,
  modalOpen,
  setModalOpen,
  description,
  closeBtn,
  closeBtnClassName,
  confirmBtn,
  href,
  modalSize = "md",
  textSize = "sm",
  children,
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (modalOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [modalOpen]);

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <dialog
      data-test-id="modal"
      ref={ref}
      role="dialog"
      aria-modal="true"
      className={`fixed left-1/2 top-1/2 z-50 !mt-none max-h-[60vh] w-4/5 -translate-x-1/2 -translate-y-1/2 overflow-auto  
        bg-white p-xl shadow-2xl outline-none md:w-auto ${
          modalOpen ? "visible" : "hidden"
        } ${modalSize === "sm" ? "max-w-[24rem]" : "max-w-md"}
        [&::backdrop]:bg-brownOpaque5
        `}
      onClick={handleClose}
    >
      {heading && (
        <Heading
          level={1}
          size={textSize}
          className={text ? "font-thin" : "pb-lg"}
        >
          {heading}
        </Heading>
      )}
      {text && (
        <p
          className={`${
            textSize === "md" ? "pt-lg text-lg text-brown-600" : ""
          } pb-lg`}
        >
          {text}
        </p>
      )}
      {description && (
        <div className="pb-lg">{HtmlParser({ text: description })}</div>
      )}

      {children && <div className="pb-lg">{children}</div>}

      <div className="flex justify-between gap-lg">
        {closeBtn && (
          <Button
            data-test-id="modal-close-btn"
            onClick={() => setModalOpen(false)}
            className={`min-w-[3.125rem] justify-center hover:bg-brown-200 ${
              closeBtnClassName ? closeBtnClassName : ""
            }`}
            variant={"secondary"}
            label={closeBtn}
            aria-label={`${closeBtn} modal ${heading}`}
          />
        )}
        {href ? (
          <ButtonLink
            href={href}
            onClick={onClick}
            label={confirmBtn}
            icon={!isExternalLink(href) ? ArrowRightIcon : ExternalIcon}
            iconPosition="right"
            className="min-w-[3.125rem] justify-center"
          />
        ) : confirmBtn ? (
          <Button
            onClick={onClick}
            label={confirmBtn}
            className="min-w-[3.125rem] justify-center"
            aria-label={`${confirmBtn} modal ${heading}`}
          />
        ) : null}
      </div>
    </dialog>
  );
};
