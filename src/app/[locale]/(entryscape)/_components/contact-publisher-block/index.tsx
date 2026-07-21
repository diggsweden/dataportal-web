"use client";

import { useTranslations } from "next-intl";
import { Box } from "@/components/box";
import { CustomLink } from "@/components/custom-link";
import { Heading } from "@/components/typography/heading";

const COMMUNITY_URL = "https://community.dataportal.se/";

interface ContactPublisherBlockProps {
  className?: string;
}

export function ContactPublisherBlock({
  className,
}: ContactPublisherBlockProps) {
  const t = useTranslations();

  return (
    <Box
      testId="contact-publisher"
      color="pink"
      padding="lg"
      className={className}
    >
      <Heading
        level={2}
        size="sm"
        className="mb-sm text-textSecondary md:mb-md"
      >
        {t("pages.datasetpage.contact-publisher")}
      </Heading>
      <p>
        {t("pages.datasetpage.contact-publisher-text")}
        {t("pages.datasetpage.contact-publisher-text2")}{" "}
        <CustomLink
          className={"hover:no-underline"}
          href={COMMUNITY_URL}
          lang="en"
        >
          community
        </CustomLink>
        .
      </p>
    </Box>
  );
}
