import { getTranslations } from "next-intl/server";

import { CustomLink } from "@/components/custom-link";
import { Container } from "@/components/layout/container";
import { FooterNav } from "@/components/navigation/footer-nav";
import type { SubLinkFooter } from "@/types/global";

import { FooterSidebarWrapper } from "./footer-sidebar-wrapper";

type FooterProps = {
  footerData: SubLinkFooter[];
};

export async function Footer({ footerData }: FooterProps) {
  const t = await getTranslations();

  return (
    <footer className="mt-xl border-t-2 border-brown-600 bg-white py-xl">
      <FooterSidebarWrapper>
        <Container className="space-y-xl md:space-y-2xl">
          <FooterNav footerData={footerData} />
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
      </FooterSidebarWrapper>
    </footer>
  );
}
