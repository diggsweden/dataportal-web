"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";

import { Heading } from "@/components/typography/heading";

export const contactPublisherBlockVariants = cva([], {
  variants: {
    variant: {
      dataset: "contact__publisher mt-md md:mt-lg",
      specification: "contact__publisher mt-md md:mt-lg",
      highlighted: "bg-pink-200 p-lg",
    },
  },
  defaultVariants: {
    variant: "dataset",
  },
});

type ContactPublisherVariant = NonNullable<
  VariantProps<typeof contactPublisherBlockVariants>["variant"]
>;

const COMMUNITY_URL = "https://community.dataportal.se/";

const headingConfig: Record<
  ContactPublisherVariant,
  {
    level: 2 | 3;
    size?: "sm";
    className?: string;
    linkClassName?: string;
    testId?: string;
  }
> = {
  dataset: {
    level: 2,
    size: "sm",
    className: "mb-sm text-textSecondary md:mb-md",
    linkClassName: "link text-md",
    testId: "contact-publisher",
  },
  specification: {
    level: 3,
    size: "sm",
    testId: "contact-publisher",
  },
  highlighted: {
    level: 3,
    linkClassName: "link",
  },
};

interface ContactPublisherBlockProps {
  variant?: ContactPublisherVariant;
  className?: string;
}

export function ContactPublisherBlock({
  variant = "dataset",
  className,
}: ContactPublisherBlockProps) {
  const t = useTranslations();
  const config = headingConfig[variant];

  return (
    <div
      className={contactPublisherBlockVariants({ variant, className })}
      {...(config.testId ? { "data-test-id": config.testId } : {})}
    >
      <Heading
        level={config.level}
        size={config.size}
        className={config.className}
      >
        {t("pages.datasetpage.contact-publisher")}
      </Heading>
      <p>
        {t("pages.datasetpage.contact-publisher-text")}
        {t("pages.datasetpage.contact-publisher-text2")}{" "}
        <a className={config.linkClassName} href={COMMUNITY_URL} lang="en">
          community
        </a>
        .
      </p>
    </div>
  );
}
