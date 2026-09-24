"use client";

import { cx } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import FullscreenIcon from "@/assets/icons/fullscreen.svg";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { EntrystoreContext } from "@/lib/entrystore/provider";

const InspectAPButton = () => {
  return (
    <span data-entryscape="specInspectAPButton" className=" empty:hidden" />
  );
};

/**
 * The specification's diagram image, with a "Visa i full storlek" button and a
 * click-to-enlarge modal. Renders nothing when the spec has no image.
 *
 * Whether there is a diagram, and which one, comes from the blocks bundle via
 * `esbBlocks.diagram(uri)`; only the layout is ours.
 */
export function SpecificationImage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const [image, setImage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const uri = entry.entry?.getResourceURI();

  useEffect(() => {
    if (!uri) return;
    let current = true;
    // Drop the previous specification's diagram while this one resolves.
    setImage(null);

    (async () => {
      try {
        await window.__entryscape_blocks_ready;
        if (!window.esbBlocks?.diagram) {
          console.error(
            "esbBlocks.diagram is missing: the blocks bundle predates it, so no diagram can be shown.",
          );
          return;
        }
        const diagram = await window.esbBlocks.diagram(uri);
        if (current) setImage(diagram?.uri ?? null);
      } catch (error) {
        console.error("Could not resolve the specification diagram:", error);
      }
    })();

    return () => {
      current = false;
    };
  }, [uri]);

  return (
    <div className={cx(image && "space-y-md md:space-y-lg mb-lg md:mb-xl")}>
      {/* Settles the diagram promise: only a block extending `loadRDs` reports it. */}
      <span data-entryscape="loadRDs" hidden />

      {image && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label={t("pages.specification_page.view_image")}
          className="block w-full cursor-pointer"
        >
          {/* biome-ignore lint/performance/noImgElement: external store SVG, not next/image-optimizable */}
          <img
            src={image}
            alt={t("pages.specification_page.image_alt", {
              title: entry.title,
            })}
            className="bg-pink-100 p-lg w-full"
          />
        </button>
      )}

      {/* Fixed position: the blocks engine only renders into nodes that were
          present when it last ran, so this must survive the image arriving. */}
      <div className="flex gap-lg items-center">
        {image && (
          <Button
            variant="secondary"
            icon={FullscreenIcon}
            iconPosition="right"
            label={t("pages.specification_page.view_image")}
            onClick={() => setModalOpen(true)}
          />
        )}
        <InspectAPButton />
      </div>

      {image && (
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
          <img
            src={image}
            alt={t("pages.specification_page.image_alt", {
              title: entry.title,
            })}
            className="w-full"
          />
        </Modal>
      )}
    </div>
  );
}
