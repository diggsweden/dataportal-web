import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { useBlocksSpa } from "@/hooks/use-blocks-spa";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const TerminologyPage: FC = () => {
  const { setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { pathname } = useRouter() || {};

  useBlocksSpa({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "terminology",
    context: entry.context,
    esId: entry.esId,
  });

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes|concepts$title"),
          link: { ...linkBase, link: `/${t("routes|concepts$path")}?q=&f=` },
        },
      ],
    });
  }, [pathname, entry.title]);

  return (
    <Container>
      {/*
              // It is possible to use a single block like this:
              <div data-entryscape="terminologyView"></div>
              // It groups together the blocks terminologyHeader, terminologyMain, terminologyInfobox and terminologyVanity used below
      */}
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        <div data-entryscape="terminologyHeader"></div>
      </Heading>

      <div className="mb-lg flex flex-col gap-xl md:mb-xl lg:flex-row lg:gap-2xl">
        {/* Left column */}
        <div className="flex w-full max-w-md flex-col">
          <div data-entryscape="terminologyMain" data-entryscape-concept-limit="5" data-entryscape-spec-usage-limit="5"/>
        </div>
        {/* Right column */}
        <div data-test-id="about-section"
          className="mb-lg h-fit w-full max-w-md bg-white p-md lg:mb-none lg:max-w-[296px]">
          <div data-entryscape="terminologyInfobox"/>
          <div data-entryscape="terminologyVanity"/>
        </div>
      </div>
    </Container>
  );
};
