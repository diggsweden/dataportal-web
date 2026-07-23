"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Heading } from "@/components/typography/heading";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { SettingsContext } from "@/providers/settings-provider";
import { handleLocale } from "@/utilities";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export default function MetadatakvalitetPage() {
  const { env } = useContext(SettingsContext);
  const t = useTranslations();
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = t("routes.metadata.title");

  useEntryScapeBlocks({
    entrystoreBase: `https://${env.ENTRYSCAPE_ADMIN_PATH}/store`,
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
  }, [pathname]);

  return (
    <Container>
      <BreadcrumbSetter {...buildBreadcrumb(pageTitle, [])} />
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {pageTitle}
      </Heading>

      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${env.ENTRYSCAPE_ADMIN_PATH}/store`}
      />

      <div data-entryscape="totMQA" className="totMQA" />
    </Container>
  );
}
