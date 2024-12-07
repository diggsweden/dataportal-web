import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC, useEffect, useState } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { CustomImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import {
  GoodExampleDataFragment,
  NewsItemDataFragment,
} from "@/graphql/__generated__/operations";
import { formatDate } from "@/utilities/date-helper";

interface PublicationTeaserProps {
  publication: GoodExampleDataFragment | NewsItemDataFragment;
}

export const PublicationTeaser: FC<PublicationTeaserProps> = ({
  publication,
}) => {
  const { publishedAt, heading, slug, image, __typename } = publication;
  const { lang } = useTranslation();
  const [date, setDate] = useState("");

  const type =
    __typename === "dataportal_Digg_News_Item"
      ? { url: `/nyheter${slug}`, name: "Nyhet" }
      : { url: `/goda-exempel${slug}`, name: "Goda Exempel" };

  useEffect(() => {
    setDate(formatDate(lang, publishedAt));
  }, []);

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
          <span className="text-textSecondary">{`${type.name} | ${date}`}</span>
          <Link
            href={type.url}
            className="before:focus--outline before:focus--out before:focus--primary focus--none no-underline before:absolute before:inset-none"
            scroll={false}
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
