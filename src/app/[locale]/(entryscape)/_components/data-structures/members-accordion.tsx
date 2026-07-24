"use client";

import { useTranslations } from "next-intl";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { Accordion } from "@/components/accordion";
import { Box } from "@/components/box";
import { ButtonLink } from "@/components/button";

interface MembersAccordionProps {
  /** Inverse relation from a member back to this scheme/vocabulary. */
  relationinverse: string;
  /** rdf:type of the members to list. */
  rdftype: string;
  /**
   * Handlebars snippet rendering one member row's link. Concepts use the
   * `conceptLink` block (pretty in-store path); classes/properties have no
   * vanity path, so a plain `{{link}}` on a config named-click route suffices.
   */
  rowLink: string;
  /** Full i18n key for the count prefix ("I terminologin ingår" …). */
  countPrefixKey:
    | "pages.terminology.includes"
    | "pages.data-vocabulary.includes";
  /** concepts key for the plural unit (begrepp / klasser / egenskaper). */
  unitKey: "concepts" | "classes" | "properties";
  /** Full i18n key for the "view all" button label. */
  viewAllKey:
    | "pages.terminology.view_all"
    | "pages.data-vocabulary.view_all_classes"
    | "pages.data-vocabulary.view_all_properties";
  viewAllHref: string;
  className?: string;
}

/**
 * One count-titled accordion listing a scheme's/vocabulary's members (concepts,
 * classes or properties). Hidden when empty; a standalone placeholder then
 * renders the same "0 …" count title in its place. Shared by the terminology
 * and data-vocabulary pages.
 */
export function MembersAccordion({
  relationinverse,
  rdftype,
  rowLink,
  countPrefixKey,
  unitKey,
  viewAllKey,
  viewAllHref,
  className,
}: MembersAccordionProps) {
  const t = useTranslations();
  const prefix = t(countPrefixKey);
  const unit = t(`pages.concepts.${unitKey}`);

  return (
    <div className={className}>
      {/* Shown only when there are 0 members (the accordion is hidden then). */}
      <span
        className="block text-lg"
        data-entryscape="listStandard"
        data-entryscape-relationinverse={relationinverse}
        data-entryscape-rdftype={rdftype}
        data-entryscape-limit="1"
        data-entryscape-listbody="<span class='hidden'>{{body}}</span>"
        data-entryscape-listplaceholder={`${prefix} <span class="font-strong">0 ${unit}</span>`}
      />

      <Accordion
        testId={`members-${unitKey}`}
        className="[&:not(:has(.member-row))]:hidden"
        title={
          <span
            data-entryscape="listStandard"
            data-entryscape-relationinverse={relationinverse}
            data-entryscape-rdftype={rdftype}
            data-entryscape-limit="1"
            data-entryscape-listbody="<span class='hidden'>{{body}}</span>"
            data-entryscape-listhead={`${prefix} <span class="font-strong">{{resultsize}} ${unit}</span>`}
          />
        }
      >
        <Box color="green">
          <div
            className="[&_.entryPagination]:hidden [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-y-sm [&_ul]:gap-x-md"
            data-entryscape="listStandard"
            data-entryscape-relationinverse={relationinverse}
            data-entryscape-rdftype={rdftype}
            data-entryscape-limit="4"
            data-entryscape-listbody="{{body}}"
            data-entryscape-rowhead={`<span class='member-row'>${rowLink}</span>`}
          />
          <ButtonLink
            href={viewAllHref}
            label={t(viewAllKey)}
            icon={ArrowRightIcon}
            iconPosition="right"
          />
        </Box>
      </Accordion>
    </div>
  );
}
