import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { includeLangInPath } from "@/utilities/check-lang";

import { NotFoundBreadcrumb } from "./_components/not-found-breadcrumb";

/**
 * Locale-scoped 404 for the App Router. Mirrors `pages/404.tsx` but runs
 * as a pure RSC (`getTranslations` + `getLocale` from `next-intl/server`).
 * Rendered inside `app/[locale]/layout.tsx` so it inherits the App Router
 * chrome (Header / Sidebar / Footer / Breadcrumbs) automatically.
 *
 * The breadcrumb label is set from a client island (`NotFoundBreadcrumb`)
 * because `LayoutStateProvider` lives client-side.
 *
 * `pages/404.tsx` stays untouched — Pages Router routes still serve it.
 */
export default async function LocaleNotFound() {
  const [t, lang] = await Promise.all([getTranslations(), getLocale()]);
  const base = includeLangInPath(lang);
  const datasetsHref = `${base}/datasets?datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24data_service%24dataset_series`;
  const heading = t("pages.notfoundpage.heading");

  return (
    <>
      <NotFoundBreadcrumb name={heading} />
      <Container>
        <Heading level={1} size="lg" className="mb-lg md:mb-xl">
          {heading}
        </Heading>

        <Preamble className="max-w-md">{t("pages.notfoundpage.body")}</Preamble>

        <ul className="space-y-md py-xl">
          <li>
            <Link href={base || "/"} className="text-lg hover:no-underline">
              {t("pages.notfoundpage.startpage")}
            </Link>
          </li>
          <li>
            <Link href={datasetsHref} className="text-lg hover:no-underline">
              {t("pages.notfoundpage.search-data")}
            </Link>
          </li>
        </ul>
      </Container>
    </>
  );
}
