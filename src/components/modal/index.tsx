"use client";

import { cva, cx, type VariantProps } from "class-variance-authority";
import { type FC, type PropsWithChildren, useEffect, useRef } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalIcon from "@/assets/icons/external-link.svg";
import { Button, ButtonLink, type ButtonVariant } from "@/components/button";
import { Heading } from "@/components/typography/heading";
import { HtmlParser } from "@/components/typography/html-parser";
import { isExternalLink } from "@/utilities";

const modalVariants = cva(
  "fixed inset-none z-50 m-auto w-4/5 overflow-auto p-xl shadow-2xl outline-none [&::backdrop]:bg-brownOpaque5",
  {
    variants: {
      size: {
        sm: "max-w-[24rem] max-h-[60vh]",
        md: "max-w-md max-h-[60vh]",
        lg: "max-w-4xl max-h-[90vh]",
      },
      color: {
        white: "bg-white",
        pink: "bg-pink-100",
      },
    },
    defaultVariants: {
      size: "md",
      color: "white",
    },
  },
);

interface ModalProps extends VariantProps<typeof modalVariants> {
  heading?: string;
  text?: string;
  onClick?: () => void;
  modalOpen: boolean;
  setModalOpen: (_param: boolean) => void;
  closeBtn?: string;
  closeBtnClassName?: string;
  closeBtnVariant?: ButtonVariant;
  confirmBtn?: string;
  confirmBtnVariant?: ButtonVariant;
  description?: string | null;
  href?: string;
  textSize?: "sm" | "md";
  ariaLabel?: string;
  className?: string;
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
  closeBtnVariant = "secondary",
  confirmBtn,
  confirmBtnVariant = "primary",
  href,
  size,
  color,
  textSize = "sm",
  className,
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
      aria-modal="true"
      className={cx(
        modalVariants({ size, color }),
        modalOpen ? "visible" : "hidden",
        className,
      )}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
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
        <div className="pb-lg">
          <HtmlParser text={description} />
        </div>
      )}

      {children && <div className="pb-lg">{children}</div>}

      <div className="flex justify-between gap-lg">
        {closeBtn && (
          <Button
            data-test-id="modal-close-btn"
            onClick={() => setModalOpen(false)}
            className={cx(
              "min-w-[3.125rem] justify-center",
              closeBtnVariant === "secondary" && "hover:bg-brown-200",
              closeBtnClassName,
            )}
            variant={closeBtnVariant}
            label={closeBtn}
            aria-label={`${closeBtn} modal ${heading}`}
          />
        )}
        {href ? (
          <ButtonLink
            href={href}
            onClick={onClick}
            label={confirmBtn}
            variant={confirmBtnVariant}
            icon={!isExternalLink(href) ? ArrowRightIcon : ExternalIcon}
            iconPosition="right"
            className="min-w-[3.125rem] justify-center"
          />
        ) : confirmBtn ? (
          <Button
            onClick={onClick}
            label={confirmBtn}
            variant={confirmBtnVariant}
            className="min-w-[3.125rem] justify-center"
            aria-label={`${confirmBtn} modal ${heading}`}
          />
        ) : null}
      </div>
    </dialog>
  );
};
