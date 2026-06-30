"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const MQACategoryPage: FC = () => {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const lang = useLocale();
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEntryScapeBlocks({
    entrystoreBase: entry.env.ENTRYSCAPE_MQA_PATH,
    env: entry.env,
    lang: lang,
    pageType: "mqa",
    context: entry.context,
    esId: entry.esId,
  });

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes.metadata.title"),
          link: {
            ...linkBase,
            link: `/${t(`routes.metadata.path`)}`,
          },
        },
      ],
    });
  }, [pathname, entry.title]);

  return (
    <Container>
      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${entry.env.ENTRYSCAPE_MQA_PATH}/store`}
      />
      <div data-entryscape="catalogMQA" className="catalogMQA" />
    </Container>
  );
};
