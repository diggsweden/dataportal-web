import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { CustomImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import {
  GoodExampleBlockItemFragment,
  GoodExampleDataFragment,
  NewsBlockItemFragment,
  NewsItemDataFragment,
} from "@/graphql/__generated__/operations";
import { formatDate } from "@/utilities/date-helper";

interface PublicationTeaserProps {
  publication:
    | GoodExampleDataFragment
    | GoodExampleBlockItemFragment
    | NewsItemDataFragment
    | NewsBlockItemFragment;
}

const NEWS_TYPES = [
  "dataportal_Digg_News_Item",
  "dataportal_Digg_NewsItem_Preview",
] as const;

const GOOD_EXAMPLE_TYPES = [
  "dataportal_Digg_GoodExample_Item",
  "dataportal_Digg_GoodExampleItem_Preview",
] as const;

export const PublicationTeaser: FC<PublicationTeaserProps> = ({
  publication,
}) => {
  const { heading, publishedAt, slug, image, __typename } = publication;
  const { lang } = useTranslation();
  const formattedDate = formatDate(lang, publishedAt);
  const goodExampleLink = (publication as GoodExampleDataFragment)?.reuse
    ? `/exempel-pa-ateranvandning${slug}`
    : `/goda-exempel${slug}`;

  function getPublicationType(__typename: string) {
    if (NEWS_TYPES.includes(__typename as (typeof NEWS_TYPES)[number])) {
      return { url: `/nyheter${slug}`, name: "Nyhet" };
    }
    if (
      GOOD_EXAMPLE_TYPES.includes(
        __typename as (typeof GOOD_EXAMPLE_TYPES)[number],
      )
    ) {
      return { url: goodExampleLink, name: "Goda Exempel" };
    }
    return { url: goodExampleLink, name: "Goda Exempel" };
  }

  const type = getPublicationType(__typename);

  return (
    <>
      <div>
        <CustomImage
          image={image}
          width={384}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="h-[11.5rem] w-full object-cover md:h-[15rem] lg:h-[11.5rem]"
        />
        <div className="px-md pt-lg text-sm text-textPrimary">
          <span className="text-textSecondary">{`${type.name} | ${formattedDate}`}</span>
          <Link
            href={type.url}
            className="before:focus--outline before:focus--out before:focus--primary focus--none no-underline before:absolute before:inset-none"
            scroll={false}
            data-tracking-name="publication-teaser"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Heading className="pb-md pt-sm" level={3} size={"sm"}>
              {heading}
            </Heading>
          </Link>
        </div>
      </div>

      <span className="button button--small button--plain focus--none group-focus-within:bg-brown-200">
        Läs mer <ArrowRightIcon height={16} width={16} viewBox="0 0 24 24" />
      </span>
    </>
  );
};
