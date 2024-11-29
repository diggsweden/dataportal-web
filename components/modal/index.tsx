import { FC, useEffect, useRef } from "react";
import { Heading } from "@/components/typography/heading";
import { Button, ButtonLink } from "@/components/button";
import ArrowIcon from "@/assets/icons/arrowRight.svg";
import { HtmlParser } from "../typography/html-parser";
import { isExternalLink } from "@/utilities";
import ExternalIcon from "@/assets/icons/external-link.svg";
import { createFocusTrap, FocusTrap } from "focus-trap";

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

  const handleEscape = (e: React.KeyboardEvent) => {
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
          <Button
            onClick={() => setModalOpen(false)}
            className="min-w-[3.125rem] justify-center hover:bg-brown-200"
            variant={"secondary"}
            label={closeBtn}
            aria-label={`${closeBtn} modal ${heading}`}
          />
          {href ? (
            <ButtonLink
              href={href}
              onClick={onClick}
              label={confirmBtn}
              icon={!isExternalLink(href) ? ArrowIcon : ExternalIcon}
              iconPosition="right"
              className="min-w-[3.125rem] justify-center"
            />
          ) : (
            <Button
              onClick={onClick}
              label={confirmBtn}
              className="min-w-[3.125rem] justify-center"
              aria-label={`${confirmBtn} modal ${heading}`}
            />
          )}
        </div>
      </div>
    </>
  );
};
