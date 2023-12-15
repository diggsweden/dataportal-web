import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { footerNav } from "./navData";
import Heading from "@/components/global/Typography/Heading";

interface FooterMenuItem {
  title: string;
  icon: any;
  type?: "internal" | "external" | "email";
  href?: string;
}

interface FooterMenuData {
  title: string;
  children: FooterMenuItem[];
}
export const NavFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-xl lg:grid lg:grid-cols-2">
      {footerNav.map((footer: FooterMenuData, idx: number) => (
        <div key={idx} className="flex flex-col gap-sm">
          <Heading size={"h5"}>{t(`common|${footer.title}`)}</Heading>
          <ul className="space-y-sm">
            {footer.children.map((link, idx: number) => (
              <li key={idx} className="text-md text-green-600 underline">
                {link.href ? (
                  <Link
                    href={link.href}
                    target="_blank"
                    className="inline-flex items-center gap-sm"
                  >
                    {link.type === "external"
                      ? t(`common|${link.title}`)
                      : link.title}
                    <link.icon
                      className="inline-flex items-center [&_path]:fill-green-600"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                    />
                  </Link>
                ) : (
                  <Link href={`/${t(`routes|${link.title}$path`)}`}>
                    {t(`routes|${link.title}$title`)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
