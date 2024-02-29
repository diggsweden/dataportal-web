import React, { useContext, useEffect } from "react";
import { BlockList } from "@/components/content/blocks/BlockList";
import { linkBase, PublicationResponse, slugify } from "@/utilities";
import { Container } from "@/components/layout/Container";
import { GridList } from "@/components/content/GridList";
import { formatDateWithTime } from "@/utilities/dateHelper";
import { Heading } from "@/components/global/Typography/Heading";
import DateIcon from "@/assets/icons/date.svg";
import useTranslation from "next-translate/useTranslation";
import { highlightCode } from "@/components/content/ContainerPage";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { usePathname } from "next/navigation";
import { SettingsContext } from "@/providers/SettingsProvider";
import { Preamble } from "@/components/global/Typography/Preamble";

const whitelistedTagsSV = ["Goda exempel", "Event", "Nyhet"];
export const findPublicationTypeTag = (tags: PublicationResponse["tags"]) => {
  return tags.find((tag) => whitelistedTagsSV.includes(tag.value));
};

const getRelatedHeading = (tag: string) => {
  switch (tag) {
    case "Event":
      return tag;
    case "Goda exempel":
      return tag;
    case "Nyhet":
      return "Nyheter";
    default:
      return "Artiklar";
  }
};

export const PublicationFull: React.FC<PublicationResponse> = ({
  tags,
  heading,
  preamble,
  image,
  name,
  blocks,
  related,
  publishedAt,
}) => {
  const tag = findPublicationTypeTag(tags);
  let relatedHeading = getRelatedHeading(tag?.value || "");
  const { t, lang } = useTranslation();
  const { trackPageView } = useMatomo();
  const pathname = usePathname();
  const { setBreadcrumb } = useContext(SettingsContext);

  useEffect(() => {
    //Highlights code using prismjs
    highlightCode();

    const crumbs = [{ name: "start", link: { ...linkBase, link: "/" } }];

    if (tag) {
      crumbs.push({
        name: relatedHeading,
        link: {
          ...linkBase,
          link: `/${slugify(relatedHeading)}`,
        },
      });
    }

    setBreadcrumb &&
      setBreadcrumb({
        name: heading,
        crumbs: crumbs,
      });

    // Matomo tracking
    trackPageView({ documentTitle: name });
  }, [pathname]);

  return (
    <Container>
      <article className="flex w-full flex-col">
        {!image && heading && (
          <Heading size={"lg"} level={1} className="mb-lg md:mb-xl">
            {heading}
          </Heading>
        )}
        <div className="flex w-full flex-col items-start justify-end gap-xl lg:flex-row-reverse">
          <aside id="sidebar" className="w-full lg:max-w-[296px]">
            <Heading
              level={2}
              size="sm"
              className="mb-md flex text-textSecondary"
            >
              <DateIcon className="mr-sm" />
              {t("common|published-date")}
            </Heading>
            <p className="ml-lg pl-md">
              {formatDateWithTime(lang, publishedAt)}
            </p>
          </aside>

          <div
            id="content"
            className="flex w-full max-w-md flex-col space-y-lg md:space-y-xl"
          >
            {!image && preamble && <Preamble>{preamble}</Preamble>}
            {blocks && blocks.length > 0 && <BlockList blocks={blocks} />}
          </div>
        </div>
        {related && related.length > 0 && (
          <GridList
            items={related}
            heading={"Fler " + relatedHeading.toLowerCase()}
          />
        )}
      </article>
    </Container>
  );
};
