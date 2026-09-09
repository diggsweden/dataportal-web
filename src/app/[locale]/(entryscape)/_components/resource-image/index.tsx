"use client";

import { cx } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef, useState } from "react";
import FullscreenIcon from "@/assets/icons/fullscreen.svg";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";

interface Diagram {
  src: string;
  alt: string;
}

interface ResourceImageProps {
  /** Extra controls beside the full-size button; rendered alone with no diagram. */
  actions?: ReactNode;
}

/**
 * A resource's diagram, with a full-size button and click-to-enlarge modal.
 * Reads its URL from the hidden `diagramImage` mount, which renders only once
 * `loadRDs` resolves.
 */
export function ResourceImage({ actions }: ResourceImageProps) {
  const t = useTranslations();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const label = t("pages.specification_page.view_image");

  useEffect(() => {
    const mount = blockRef.current;
    if (!mount) return;

    const read = () => {
      const image = mount.querySelector("img");
      setDiagram((current) => {
        // No src yet: the block is mid-render, wait for the next mutation.
        if (!image?.getAttribute("src")) return null;
        // Same image, re-reported: keep the object so nothing re-renders.
        if (current?.src === image.src && current.alt === image.alt) {
          return current;
        }
        return { src: image.src, alt: image.alt };
      });
    };

    const observer = new MutationObserver(read);
    observer.observe(mount, {
      childList: true,
      subtree: true,
      attributeFilter: ["src"],
    });
    read();

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={blockRef} data-entryscape="diagramImage" hidden />

      {diagram && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label={label}
          className="block w-full cursor-pointer"
        >
          {/* biome-ignore lint/performance/noImgElement: external store SVG, not next/image-optimizable */}
          <img
            src={diagram.src}
            alt={diagram.alt}
            className="bg-pink-100 p-lg w-full"
          />
        </button>
      )}

      {/* Always rendered when `actions` exists: the blocks engine only
          renders into nodes that were present when it last ran. */}
      {(diagram || actions) && (
        <div
          className={cx(
            "flex gap-lg items-center",
            diagram && "mt-md md:mt-lg mb-lg md:mb-xl",
          )}
        >
          {diagram && (
            <Button
              variant="secondary"
              icon={FullscreenIcon}
              iconPosition="right"
              label={label}
              onClick={() => setModalOpen(true)}
            />
          )}
          {actions}
        </div>
      )}

      {diagram && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          closeBtn={t("common.close")}
          closeBtnClassName="mx-auto"
          closeBtnVariant="primary"
          color="pink"
          size="lg"
        >
          {/* biome-ignore lint/performance/noImgElement: external store SVG, not next/image-optimizable */}
          <img src={diagram.src} alt={diagram.alt} className="w-full" />
        </Modal>
      )}
    </>
  );
}
