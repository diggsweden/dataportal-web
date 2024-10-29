import { FC, useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import { Heading } from "@/components/global/Typography/Heading";
import { footerNav } from "@/utilities/menuData";
import Link from "next/link";
import { SettingsContext } from "@/providers/SettingsProvider";

interface FooterNavItem {
  title: string;
  icon: any;
  type?: "internal" | "external" | "email";
  href?: string;
}

interface FooterNavData {
  title: string;
  children: FooterNavItem[];
}

interface FooterNavProps {
  setOpenSideBar: Function;
}

export const FooterNav: FC<FooterNavProps> = ({ setOpenSideBar }) => {
  const { t } = useTranslation();
  const { iconSize } = useContext(SettingsContext);

  return (
    <nav
      aria-label={t("common|menu-footer")}
      className="flex flex-col space-y-xl lg:grid lg:grid-cols-2 lg:gap-xl"
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
                    <link.icon
                      className="mb-[2px] ml-xs inline-block [&_path]:fill-green-600"
                      width={iconSize}
                      height={iconSize}
                      viewBox="0 0 24 24"
                    />
                  </Link>
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
