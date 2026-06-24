"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";
import { SettingsContext } from "@/providers/settings-provider";
import { handleLocale, linkBase } from "@/utilities";

export const MQAPage: FC = () => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const t = useTranslations();
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = t("routes.metadata.title");

  useEntryScapeBlocks({
    entrystoreBase: `https://${env.ENTRYSCAPE_MQA_PATH}/store`,
    env: env,
    lang: lang,
    pageType: "mqa",
    context: "",
    esId: "",
  });

  useEffect(() => {
    // Remove locale from path if it's the default locale
    if (pathname)
      handleLocale(window.location.pathname, lang, pathname, router);

    setBreadcrumb?.({
      name: pageTitle,
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname]);

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {pageTitle}
      </Heading>

      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${env.ENTRYSCAPE_MQA_PATH}/store`}
      />

      <div data-entryscape="totMQA" className="totMQA" />
    </Container>
  );
};
