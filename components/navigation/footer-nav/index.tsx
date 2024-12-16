import useTranslation from "next-translate/useTranslation";
import { FC, Fragment, useContext } from "react";

import { CustomLink } from "@/components/custom-link";
import { Heading } from "@/components/typography/heading";
import { MenuLinkFragment } from "@/graphql/__generated__/operations";
import { LocalStoreContext } from "@/providers/local-store-provider";
import { SubLinkFooter } from "@/types/global";

interface FooterNavProps {
  footerData: SubLinkFooter[];
  setOpenSideBar: (_param: boolean) => void;
  setSettingsOpen: (_param: boolean) => void;
}

export const FooterNav: FC<FooterNavProps> = ({
  footerData,
  setOpenSideBar,
  setSettingsOpen,
}) => {
  const { t } = useTranslation();
  const { set } = useContext(LocalStoreContext);

  return (
    <nav
      aria-label={t("common|menu-footer")}
      className="flex flex-col gap-xl lg:grid lg:grid-cols-2"
    >
      {footerData?.length > 0 ? (
        footerData.map((footer: SubLinkFooter, footerIdx: number) => (
          <div key={footerIdx} className="flex flex-col gap-sm">
            <Heading size={"sm"} level={2} className="!text-lg">
              {footer.title}
            </Heading>
            <ul className="space-y-sm">
              {footer.links.map((link: MenuLinkFragment, linkIdx: number) => (
                <Fragment key={linkIdx}>
                  <li className="text-md text-green-600">
                    <CustomLink
                      href={link.link}
                      className="hover:no-underline"
                      onClick={() => setOpenSideBar(false)}
                    >
                      {link.name}
                    </CustomLink>
                  </li>
                  {footerIdx === 0 && linkIdx === footer.links.length - 1 && (
                    <li className="text-md text-green-600">
                      <button
                        onClick={() => {
                          set({ cookieSettings: {} });
                          setSettingsOpen(true);
                        }}
                        className="cursor-pointer underline underline-offset-4 hover:no-underline"
                      >
                        {t("common|cookie-settings")}
                      </button>
                    </li>
                  )}
                </Fragment>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-sm">
          <Heading className="!text-lg" size={"sm"} level={2}>
            {t("common|dataportal")}
          </Heading>
          <button
            onClick={() => {
              set({ cookieSettings: {} });
              setSettingsOpen(true);
            }}
            className="inline-flex w-fit cursor-pointer text-md text-green-600 underline underline-offset-4 hover:no-underline"
          >
            {t("common|cookie-settings")}
          </button>
        </div>
      )}
    </nav>
  );
};
