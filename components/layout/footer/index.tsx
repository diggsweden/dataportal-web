"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";

import { CustomLink } from "@/components/custom-link";
import { Container } from "@/components/layout/container";
import { FooterNav } from "@/components/navigation/footer-nav";
import { SubLinkFooter } from "@/types/global";

type FooterProps = {
  footerData: SubLinkFooter[];
  openSideBar: boolean;
  setOpenSideBar: (_param: boolean) => void;
  setSettingsOpen: (_param: boolean) => void;
};

export const Footer: FC<FooterProps> = ({
  footerData,
  openSideBar,
  setOpenSideBar,
  setSettingsOpen,
}) => {
  const t = useTranslations();
  return (
    <footer className="mt-xl border-t-2 border-brown-600 bg-white py-xl">
      <div
        className={`transition-all duration-300 ease-in-out ${
          openSideBar ? "xl:w-[calc(100vw-18.75rem)]" : "w-full"
        }`}
      >
        <Container className="space-y-xl md:space-y-2xl">
          <FooterNav
            footerData={footerData}
            setSettingsOpen={setSettingsOpen}
            setOpenSideBar={setOpenSideBar}
          />
          <div className="mr-lg align-top">
            <span className="font-strong">Sveriges dataportal </span>
            <span>{t("common.managed-and-developed-by")}</span>
            <CustomLink
              aria-label="Digg - Myndigheten för digital förvaltning"
              href={"https://digg.se/"}
              className="min-w-min text-green-600 hover:no-underline [&_path]:fill-green-600"
            >
              Digg - Myndigheten för digital förvaltning
            </CustomLink>
          </div>
        </Container>
      </div>
    </footer>
  );
};
