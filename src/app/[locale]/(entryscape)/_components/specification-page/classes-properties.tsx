"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { Accordion } from "@/components/accordion";
import { Box } from "@/components/box";
import { LabelLink } from "@/components/label-link";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";

/**
 * The specification's introduced/reused classes and properties, each group an
 * accordion of term links. Renders nothing when the spec introduces/reuses none.
 */
export function SpecificationClasses() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  const termGroups = [
    {
      items: entry.introducedClasses,
      label: t("pages.specification_page.introduced_classes"),
    },
    {
      items: entry.introducedProperties,
      label: t("pages.specification_page.introduced_properties"),
    },
    {
      items: entry.reusedClasses,
      label: t("pages.specification_page.reused_classes"),
    },
    {
      items: entry.reusedProperties,
      label: t("pages.specification_page.reused_properties"),
    },
  ];

  if (
    !(
      entry.introducedClasses?.length ||
      entry.introducedProperties?.length ||
      entry.reusedClasses?.length ||
      entry.reusedProperties?.length
    )
  ) {
    return null;
  }

  return (
    <>
      <Heading level={2} size="md" className="mb-md md:mb-lg">
        {t("pages.specification_page.classes_and_properties")}
      </Heading>

      <div className="mb-lg space-y-lg">
        {termGroups.map(({ items, label }) =>
          items?.length ? (
            <Accordion
              key={label}
              title={
                <>
                  <span className="font-strong">{items.length}</span> {label}
                </>
              }
              defaultOpen={true}
            >
              <Box
                color="green"
                padding="md"
                className="flex flex-wrap gap-x-lg gap-y-sm mb-md"
              >
                {items.map((item) => (
                  <LabelLink
                    key={`${item.url ?? ""}|${item.title}`}
                    value={item}
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
            </Accordion>
          ) : null,
        )}
      </div>
    </>
  );
}
