"use client";

import { useTranslations } from "next-intl";
import { Box } from "@/components/box";
import { Heading } from "@/components/typography/heading";

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
      <p>{t("pages.datasetpage.contact-publisher-text")}</p>
    </Box>
  );
}
