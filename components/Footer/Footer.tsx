import { Container, css, DiggLogo } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import Image from "next/image";
import euLogo from "../../public/images/eu.png";
import { MenuFooter } from "../Navigation/Menu/Menu-Footer";

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
          <MenuFooter />

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
