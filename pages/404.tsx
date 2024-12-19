import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

const NotFound: FC = () => {
  const { t, lang } = useTranslation("pages");
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb?.({
      name: t("notfoundpage$heading"),
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname, setBreadcrumb]);

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {t("notfoundpage$heading")}
      </Heading>

      <Preamble className="max-w-md">{t("notfoundpage$body")}</Preamble>
      <ul className="space-y-md py-xl">
        <li>
          <Link href={`/`} locale={lang} className="text-lg hover:no-underline">
            {t("notfoundpage$startpage")}
          </Link>
        </li>
        <li>
          <Link
            href={`/datasets?datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24data_service%24dataset_series`}
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

export const getStaticProps = async () => {
  return {
    props: {
      type: "NotFound",
    },
  };
};

export default NotFound;
