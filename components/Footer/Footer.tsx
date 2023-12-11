import { Container, css, DiggLogo } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import euLogo from "../../public/images/eu.png";
import { footerContent } from "./footerContent";
interface FooterLink {
  title: string;
  children: {
    title: string;
    icon?: any;
    href: string;
    type: string;
  }[];
}

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <Container
        cssProp={css`
          max-width: calc(100% - 2rem);
          margin: auto;
        `}
      >
        <div className="footer-main">
          <div className="footer__links">
            {footerContent.map((footer: FooterLink, idx: number) => (
              <div key={idx} className="footer__links__group">
                <h2>{t(`common|${footer.title}`)}</h2>
                <ul>
                  {footer.children.map((link, idx: number) => (
                    <li key={idx}>
                      {link.type === "internal" ? (
                        <Link href={t(`routes|${link.title}$path`)}>
                          {t(`routes|${link.title}$title`)}
                        </Link>
                      ) : link.type === "external" ? (
                        <Link href={link.href} target="_blank">
                          {t(`common|${link.title}`)}
                          <Image
                            src={link.icon}
                            alt="link icon"
                            className="svg"
                          />
                        </Link>
                      ) : (
                        <Link href={link.href}>
                          {link.title}
                          <Image
                            src={link.icon}
                            alt="link icon"
                            className="svg"
                          />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="digg__">
            <p className="text-sm">{t("common|digg-managed_text")}</p>
            <div className="footer__logos">
              <div className="footer__logos-digg">
                <DiggLogo
                  title={t("common|digg-logo_text")}
                  id="footer"
                  mode="wide"
                  width={30 * 16}
                />
              </div>
              <Image src={euLogo} alt="" width={200} />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
