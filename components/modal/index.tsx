import { createFocusTrap, FocusTrap } from "focus-trap";
import { FC, useEffect, useRef, KeyboardEvent } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalIcon from "@/assets/icons/external-link.svg";
import { Button, ButtonLink } from "@/components/button";
import { Heading } from "@/components/typography/heading";
import { isExternalLink } from "@/utilities";

import { HtmlParser } from "../typography/html-parser";

interface ModalProps {
  heading: string;
  text?: string;
  onClick?: () => void;
  modalOpen: boolean;
  setModalOpen: (_param: boolean) => void;
  closeBtn?: string;
  confirmBtn?: string;
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
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (modalOpen && ref.current) {
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
        ref={ref}
        className={`fixed left-1/2 top-1/2 z-50 !mt-none max-h-[60vh] w-4/5 max-w-md -translate-x-1/2 -translate-y-1/2  
        overflow-auto bg-white p-xl shadow-2xl md:w-auto ${
          modalOpen ? "visible" : "hidden"
        }`}
        onKeyDown={handleEscape}
      >
        {heading && (
          <Heading
            level={1}
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
          {closeBtn && (
            <Button
              onClick={() => setModalOpen(false)}
              className="min-w-[3.125rem] justify-center hover:bg-brown-200"
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
