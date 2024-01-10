import { Container, Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { MainContainerStyle } from "../styles/general/emotion";

const NotFound: React.FC = () => {
  const { t, lang } = useTranslation("pages");
  return (
    <Container
      cssProp={MainContainerStyle}
      wrapperProps={{ className: "notfoundpage" }}
    >
      <Heading>{t("notfoundpage$heading")}</Heading>
      <div className="content notfoundpage__content">
        <span className="text-md">{t("notfoundpage$body")}</span>
        <ul>
          <li>
            <Link href={`/`} locale={lang} className="text-lg">
              {t("notfoundpage$startpage")}
            </Link>
          </li>
          <li>
            <Link
              href={`/datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24esterms_IndependentDataService%24esterms_ServedByDataService&c=false`}
              locale={lang}
              className="text-lg"
            >
              {t("notfoundpage$search-data")}
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default NotFound;
