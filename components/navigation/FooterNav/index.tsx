import { FC, useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import { Heading } from "@/components/global/Typography/Heading";
import { footerNav } from "@/utilities/menuData";
import Link from "next/link";
import { SettingsContext } from "@/providers/SettingsProvider";
import { LocalStoreContext } from "@/providers/LocalStoreProvider";

interface FooterNavItem {
  title: string;
  icon?: any;
  type?: "internal" | "external" | "email" | "cookie";
  href?: string;
}

interface FooterNavData {
  title: string;
  children: FooterNavItem[];
}

interface FooterNavProps {
  setOpenSideBar: Function;
  setSettingsOpen: Function;
}

export const FooterNav: FC<FooterNavProps> = ({
  setOpenSideBar,
  setSettingsOpen,
}) => {
  const { t } = useTranslation();
  const { iconSize } = useContext(SettingsContext);
  const { set } = useContext(LocalStoreContext);

  return (
    <nav
      aria-label={t("common|menu-footer")}
      className="flex flex-col gap-xl lg:grid lg:grid-cols-2"
    >
      {footerNav.map((footer: FooterNavData, idx: number) => (
        <div key={idx} className="flex flex-col gap-sm">
          <Heading size={"sm"} level={2} className="!text-lg">
            {t(`common|${footer.title}`)}
          </Heading>
          <ul className="space-y-sm">
            {footer.children.map((link, idx: number) => (
              <li
                key={idx}
                className="text-md text-green-600"
                onClick={() =>
                  link.type === "internal" && setOpenSideBar(false)
                }
              >
                {link.href ? (
                  <Link href={link.href} className="hover:no-underline">
                    {link.type === "external"
                      ? t(`common|${link.title}`)
                      : link.title}
                    {link.icon && (
                      <link.icon
                        className="mb-[2px] ml-xs inline-block [&_path]:fill-green-600"
                        width={iconSize}
                        height={iconSize}
                        viewBox="0 0 24 24"
                      />
                    )}
                  </Link>
                ) : link.type === "cookie" ? (
                  <button
                    onClick={() => {
                      set({ cookieSettings: {} });
                      setSettingsOpen(true);
                    }}
                    className="cursor-pointer underline underline-offset-4 hover:no-underline"
                  >
                    {t(`common|${link.title}`)}
                  </button>
                ) : (
                  <Link
                    href={`/${t(`routes|${link.title}$path`)}`}
                    className="hover:no-underline"
                  >
                    {t(`routes|${link.title}$title`)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
