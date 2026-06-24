import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { type FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

const NotFound: FC = () => {
  const t = useTranslations();
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb?.({
      name: t("pages.notfoundpage.heading"),
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname, setBreadcrumb]);

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {t("pages.notfoundpage.heading")}
      </Heading>

      <Preamble className="max-w-md">{t("pages.notfoundpage.body")}</Preamble>
      <ul className="space-y-md py-xl">
        <li>
          <Link href={`/`} className="text-lg hover:no-underline">
            {t("pages.notfoundpage.startpage")}
          </Link>
        </li>
        <li>
          <Link
            href={`/datasets?datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24data_service%24dataset_series`}
            className="text-lg hover:no-underline"
          >
            {t("pages.notfoundpage.search-data")}
          </Link>
        </li>
      </ul>
    </Container>
  );
};

export default NotFound;
