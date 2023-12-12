import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { footerMenu } from "./menu-data";

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
export const MenuFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="footer__links">
      {footerMenu.map((footer: FooterMenuData, idx: number) => (
        <div key={idx} className="footer__links__group">
          <h2>{t(`common|${footer.title}`)}</h2>
          <ul>
            {footer.children.map((link, idx: number) => (
              <li key={idx}>
                {link.href ? (
                  <Link href={link.href} target="_blank">
                    {link.type === "external"
                      ? t(`common|${link.title}`)
                      : link.title}
                    <Image src={link.icon} alt="link icon" className="svg" />
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
