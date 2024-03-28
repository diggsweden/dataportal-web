import useTranslation from "next-translate/useTranslation";
import { FC, useEffect, useState } from "react";
import { CustomImage } from "@/components/global/CustomImage";
import ArrowIcon from "@/assets/icons/arrowRight.svg";
import {
  GoodExampleDataFragment,
  NewsItemDataFragment,
} from "@/graphql/__generated__/operations";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import { formatDate } from "@/utilities/dateHelper";

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
    <Link
      href={type.url}
      className="group flex h-full flex-col justify-between no-underline"
      scroll={false}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <div>
        <CustomImage
          image={image}
          width={384}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="h-[184px] w-full object-cover md:h-[240px] lg:h-[184px]"
        />
        <div className="px-md pt-lg text-sm text-textPrimary">
          <span className="text-textSecondary">{`${type.name} | ${date}`}</span>
          <Heading className="pb-md pt-sm" level={3} size={"sm"}>
            {heading}
          </Heading>
        </div>
      </div>

      <span className="button button--small button--plain focus--none">
        Läs mer <ArrowIcon height={16} width={16} viewBox="0 0 24 24" />
      </span>
    </Link>
  );
};
