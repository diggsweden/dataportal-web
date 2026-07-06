import { useLocale } from "next-intl";
import type { FC } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { CustomImage, mediaTypeToImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import type {
  GoodExampleBlockItemFragment,
  GoodExampleDataFragment,
  NewsBlockItemFragment,
  NewsItemDataFragment,
} from "@/graphql/gql/graphql";
import { formatDate } from "@/utilities/date-helper";

import { TeaserLink } from "./teaser-link";

export type PublicationTeaserItem =
  | GoodExampleDataFragment
  | GoodExampleBlockItemFragment
  | NewsItemDataFragment
  | NewsBlockItemFragment;

interface PublicationTeaserProps {
  publication: PublicationTeaserItem;
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
  const { heading, publishedAt, slug, __typename } = publication;
  // Full items expose `image` as a `MediaType` union; preview items expose
  // it as a masked `Image` fragment. Normalise both to a masked `Image`.
  const heroImage =
    publication.__typename === "dataportal_Digg_News_Item" ||
    publication.__typename === "dataportal_Digg_Good_Example"
      ? mediaTypeToImage(publication.image)
      : publication.image;
  const lang = useLocale();
  const formattedDate = formatDate(lang, publishedAt);
  const goodExampleLink = (publication as GoodExampleDataFragment)?.reuse
    ? `/exempel-pa-ateranvandning${slug}`
    : `/exempel-datadriven-transformation${slug}`;

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
          image={heroImage}
          width={384}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="h-[11.5rem] w-full object-cover md:h-[15rem] lg:h-[11.5rem]"
        />
        <div className="px-md pt-lg text-sm text-textPrimary">
          <span className="text-textSecondary">{`${type.name} | ${formattedDate}`}</span>
          <TeaserLink href={type.url}>
            <Heading className="pb-md pt-sm" level={3} size={"sm"}>
              {heading}
            </Heading>
          </TeaserLink>
        </div>
      </div>

      <span className="button button--small button--plain focus--none group-focus-within:bg-brown-200">
        Läs mer <ArrowRightIcon height={16} width={16} viewBox="0 0 24 24" />
      </span>
    </>
  );
};
