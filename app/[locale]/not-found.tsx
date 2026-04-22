"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";

export default function NotFound() {
  const t = useTranslations("pages");
  const lang = useLocale();

  return (
    <Container>
      <Heading level={1} size="lg" className="mb-lg md:mb-xl">
        {t("notfoundpage.heading")}
      </Heading>
      <Preamble className="max-w-md">{t("notfoundpage.body")}</Preamble>
      <ul className="space-y-md py-xl">
        <li>
          <Link href="/" locale={lang} className="text-lg hover:no-underline">
            {t("notfoundpage.startpage")}
          </Link>
        </li>
        <li>
          <Link
            href="/datasets?p=1&q=&s=2&t=20&f=&rt=dataset%24data_service%24dataset_series"
            locale={lang}
            className="text-lg hover:no-underline"
          >
            {t("notfoundpage.search-data")}
          </Link>
        </li>
      </ul>
    </Container>
  );
}
