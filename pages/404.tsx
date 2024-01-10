import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";

const NotFound: React.FC = () => {
  const { t, lang } = useTranslation("pages");
  return (
    <Container>
      <Heading level={1} size={"lg"} className="pb-lg pt-xl">
        {t("notfoundpage$heading")}
      </Heading>

      <p className="max-w-md text-lg">{t("notfoundpage$body")}</p>
      <ul className="space-y-md py-xl">
        <li>
          <Link href={`/`} locale={lang} className="text-lg hover:no-underline">
            {t("notfoundpage$startpage")}
          </Link>
        </li>
        <li>
          <Link
            href={`/datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24esterms_IndependentDataService%24esterms_ServedByDataService&c=false`}
            locale={lang}
            className="text-lg hover:no-underline"
          >
            {t("notfoundpage$search-data")}
          </Link>
        </li>
      </ul>
    </Container>
  );
};

export default NotFound;
