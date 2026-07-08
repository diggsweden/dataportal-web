"use client";

import { useLocale, useTranslations } from "next-intl";
import { useContext } from "react";

import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function MQACategoryPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const lang = useLocale();

  useEntryScapeBlocks({
    entrystoreBase: `https://${entry.env.ENTRYSCAPE_MQA_PATH}/store`,
    env: entry.env,
    lang: lang,
    pageType: "mqa",
    context: entry.context,
    esId: entry.esId,
  });

  return (
    <Container>
      <BreadcrumbSetter
        {...buildBreadcrumb(entry.title, [
          {
            name: t("routes.metadata.title"),
            link: `/${t("routes.metadata.path")}`,
          },
        ])}
      />
      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${entry.env.ENTRYSCAPE_MQA_PATH}/store`}
      />
      <div data-entryscape="catalogMQA" className="catalogMQA" />
    </Container>
  );
}
