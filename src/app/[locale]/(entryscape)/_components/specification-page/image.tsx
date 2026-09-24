"use client";

import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
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
 */
export function SpecificationImage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);

  if (!entry.image) return <InspectAPButton />;

  return (
    <div className="space-y-md md:space-y-lg mb-lg md:mb-xl">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label={t("pages.specification_page.view_image")}
        className="block w-full cursor-pointer"
      >
        {/* biome-ignore lint/performance/noImgElement: external store SVG, not next/image-optimizable */}
        <img
          src={entry.image}
          alt={entry.title}
          className="bg-pink-100 p-lg w-full max-w-full"
        />
      </button>
      <div className="flex gap-lg items-center">
        <Button
          variant="secondary"
          icon={FullscreenIcon}
          iconPosition="right"
          label={t("pages.specification_page.view_image")}
          onClick={() => setModalOpen(true)}
        />
        <InspectAPButton />
      </div>

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
          src={entry.image}
          alt={entry.title}
          className="w-full max-w-full"
        />
      </Modal>
    </div>
  );
}
