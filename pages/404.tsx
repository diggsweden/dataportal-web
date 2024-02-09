import { Heading } from "@/components/global/Typography/Heading";
import { Preamble } from "@/components/global/Typography/Preamble";
import { Container } from "@/components/layout/Container";
import { SettingsContext } from "@/providers/SettingsProvider";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { FC, useContext, useEffect } from "react";
import { linkBase } from "@/utilities";
import { usePathname } from "next/navigation";

const NotFound: FC = () => {
  const { t, lang } = useTranslation("pages");
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
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
