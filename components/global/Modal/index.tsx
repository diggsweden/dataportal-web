import { FC, useRef } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { Button, ButtonLink } from "@/components/global/Button";
import ArrowIcon from "@/assets/icons/arrowRight.svg";

interface ModalProps {
  heading: string;
  text?: string;
  onClick?: () => void;
  modalOpen: boolean;
  setModalOpen: Function;
  closeBtn: string;
  confirmBtn: string;
  href?: string;
}

export const Modal: FC<ModalProps> = ({
  heading,
  text,
  onClick,
  modalOpen,
  setModalOpen,
  closeBtn,
  confirmBtn,
  href,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        className={`absolute left-none top-none z-40 !mt-none h-full w-full bg-brownOpaque5 
        ${modalOpen ? "visible" : "hidden"}`}
        onClick={() => setModalOpen(false)}
      />
      <div
        ref={ref}
        className={`fixed left-1/2 top-1/2 z-50 !mt-none max-w-md -translate-x-1/2 
        -translate-y-1/2 bg-white p-xl shadow-2xl ${
          modalOpen ? "visible" : "hidden"
        }`}
        onClick={(e) => {
          if (e.currentTarget !== e.target) {
            setModalOpen(false);
          }
        }}
      >
        {heading && (
          <Heading level={3} size="sm" className={text ? "" : "pb-lg"}>
            {heading}
          </Heading>
        )}
        {text && <p className="pb-lg">{text}</p>}
        <div className="flex justify-between">
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
              icon={ArrowIcon}
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