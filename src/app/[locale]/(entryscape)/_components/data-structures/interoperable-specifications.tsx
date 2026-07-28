"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import ListBlockIcon from "@/assets/icons/list-block.svg";
import { Accordion } from "@/components/accordion";
import { Box } from "@/components/box";
import { LabelLink } from "@/components/label-link";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";

/**
 * Main-column accordion listing the interoperable specifications that use this
 * terminology / data vocabulary. Renders nothing when there are none. Shared by
 * the terminology and data-vocabulary pages.
 */
export function InteroperableSpecificationsAccordion() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const specs = entry.relatedSpecificationsInteroperable;

  if (!specs?.length) return null;

  return (
    <Accordion
      testId="used-in-specifications"
      title={
        <span>
          {t("common.used-in")}{" "}
          <span className="font-strong">
            {specs.length} {t("common.interoperable-specifications")}
          </span>
        </span>
      }
      className="mt-lg"
    >
      <ul className="space-y-sm">
        {specs.map((spec) => (
          <li key={spec.url}>
            <Box color="white">
              <LabelLink
                value={spec}
                size="medium"
                color="primary"
                underline={false}
              />
            </Box>
          </li>
        ))}
      </ul>
    </Accordion>
  );
}

interface InteroperableSpecificationsCardProps {
  /** i18n key for the "… use this X" label (terminology vs data vocabulary). */
  labelKey:
    | "pages.terminology.specifications_use"
    | "pages.data-vocabulary.specifications_use";
}

/**
 * Sidebar count card: "N interoperable specifications use this terminology /
 * data vocabulary". Shared by the terminology and data-vocabulary pages.
 */
export function InteroperableSpecificationsCard({
  labelKey,
}: InteroperableSpecificationsCardProps) {
  const entry = useContext(EntrystoreContext);
  const { iconSize } = useContext(SettingsContext);
  const t = useTranslations();

  return (
    <Box color="white" padding="xl" rounded={true}>
      <div className="flex items-center gap-sm">
        <ListBlockIcon
          className="flex-shrink-0 text-primary"
          height={iconSize * 3}
          width={iconSize * 3}
          viewBox={`0 0 ${iconSize * 1.5} ${iconSize * 1.5}`}
        />

        <span className="text-xl md:text-2xl text-primary">
          {entry.relatedSpecificationsInteroperable?.length}
        </span>
        <span className="text-sm leading-4">{t(labelKey)}</span>
      </div>
    </Box>
  );
}
