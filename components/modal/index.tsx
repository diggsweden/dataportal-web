import { createFocusTrap, FocusTrap } from "focus-trap";
import { FC, useEffect, useRef, KeyboardEvent, PropsWithChildren } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalIcon from "@/assets/icons/external-link.svg";
import { Button, ButtonLink } from "@/components/button";
import { Heading } from "@/components/typography/heading";
import { isExternalLink } from "@/utilities";

import { HtmlParser } from "../typography/html-parser";

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
  const ref = useRef<HTMLDivElement>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (modalOpen && ref.current) {
      // Focus the modal container itself to prevent scroll to bottom when modal opens
      ref.current.scrollTo({ top: 0, behavior: "instant" });
      ref.current.focus();

      trapRef.current = createFocusTrap(ref.current, {
        escapeDeactivates: false,
        allowOutsideClick: true,
      });
      trapRef.current.activate();
    }

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
      }
    };
  }, [modalOpen]);

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && modalOpen) {
      setModalOpen(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-none z-40 overflow-hidden bg-brownOpaque5 
        ${modalOpen ? "visible" : "hidden"}`}
        onClick={() => setModalOpen(false)}
      />
      <div
        data-test-id="modal"
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        aria-describedby="modal-description"
        className={`fixed left-1/2 top-1/2 z-50 !mt-none max-h-[60vh] w-4/5 -translate-x-1/2 -translate-y-1/2 overflow-auto  
        bg-white p-xl shadow-2xl outline-none md:w-auto ${
          modalOpen ? "visible" : "hidden"
        } ${modalSize === "sm" ? "max-w-[24rem]" : "max-w-md"}`}
        onKeyDown={handleEscape}
      >
        {heading && (
          <Heading
            level={1}
            size={textSize}
            className={text ? "font-thin" : "pb-lg"}
            id="modal-heading"
          >
            {heading}
          </Heading>
        )}
        {text && (
          <p
            id="modal-description"
            className={`${
              textSize === "md" ? "pt-lg text-lg text-brown-600" : ""
            } pb-lg`}
          >
            {text}
          </p>
        )}
        {description && (
          <div id="modal-description" className="pb-lg">
            {HtmlParser({ text: description })}
          </div>
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
      </div>
    </>
  );
};
