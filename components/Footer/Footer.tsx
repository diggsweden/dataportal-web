import useTranslation from "next-translate/useTranslation";
import React from "react";
import Image from "next/image";
import euLogo from "../../public/images/eu.png";
import { MenuFooter } from "../Navigation/Menu/Menu-Footer";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div>
        <div className="footer-main">
          <MenuFooter />

          <div className="digg__">
            <p className="text-sm">{t("common|digg-managed_text")}</p>
            <div className="footer__logos">
              <div className="footer__logos-digg"></div>
              <Image src={euLogo} alt="" width={200} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
