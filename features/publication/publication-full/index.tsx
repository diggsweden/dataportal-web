import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useState } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import DataIcon from "@/assets/icons/data.svg";
import DateIcon from "@/assets/icons/date.svg";
import ExternalIcon from "@/assets/icons/external-link.svg";
import HoldingHandsIcon from "@/assets/icons/holding-hands.svg";
import KeywordTagIcon from "@/assets/icons/keyword-tag.svg";
import NewsIcon from "@/assets/icons/news.svg";
import OrganisationIcon from "@/assets/icons/organisation.svg";
import StarIcon from "@/assets/icons/star.svg";
import { BlockList } from "@/components/blocks/block-list";
import { ButtonLink } from "@/components/button";
import { GridList } from "@/components/grid-list";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { highlightCode } from "@/features/pages/container-page";
import { SettingsContext } from "@/providers/settings-provider";
import {
  GoodExampleResponse,
  isExternalLink,
  linkBase,
  NewsItemResponse,
  slugify,
} from "@/utilities";
import { formatDateWithTime } from "@/utilities/date-helper";

type infoSection = {
  title: string;
  value?: string;
  icon: React.ReactNode;
  type?: "tag" | "plain";
  onlyReuse?: boolean;
};

export const PublicationFull: FC<NewsItemResponse | GoodExampleResponse> = ({
  ...publication
}) => {
  const isReuse = (publication as GoodExampleResponse)?.reuse || false;
  const type =
    publication.__typename === "dataportal_Digg_News_Item"
      ? { name: "Nyheter", publisher: null, apiAndDataset: null }
      : {
          name: isReuse ? "Exempel på återanvändning" : "Goda Exempel",
          publisher: publication.publisher,
          apiAndDataset: publication.apiAndDataset,
          typeOfReuse: publication.typeOfReuse,
          benefit: publication.benefit,
          category: publication.category,
          link: publication.link,
          entity: publication.entity,
        };

  const { t, lang } = useTranslation();
  const pathname = usePathname();
  const { setBreadcrumb } = useContext(SettingsContext);
  const [date, setDate] = useState("");

  const infoSection: infoSection[] = [
    {
      title: isReuse ? "Avsändare" : "Om",
      value: type.publisher ?? undefined,
      icon: <StarIcon className="mr-sm" />,
      type: "plain",
    },
    {
      title: "Typ av aktör",
      value: type.entity ?? undefined,
      icon: <OrganisationIcon className="mr-sm" />,
      type: "plain",
    },
    {
      title: "Typ av återanvändning",
      value: type.typeOfReuse ?? undefined,
      icon: <NewsIcon className="mr-sm" />,
      type: "plain",
      onlyReuse: true,
    },
    {
      title: "Nytta",
      value: type.benefit ?? undefined,
      icon: <HoldingHandsIcon className="mr-sm" />,
      type: "plain",
      onlyReuse: true,
    },
    {
      title: "Kategori",
      value: type.category ?? undefined,
      icon: <KeywordTagIcon className="mr-sm" />,
      type: "tag",
      onlyReuse: true,
    },
  ];

  useEffect(() => {
    //Highlights code using prismjs
    highlightCode(t);

    const crumbs = [{ name: "start", link: { ...linkBase, link: "/" } }];

    crumbs.push({
      name: type.name,
      link: {
        ...linkBase,
        link: `/${slugify(type.name)}`,
      },
    });

    setBreadcrumb?.({
      name: publication.heading,
      crumbs: crumbs,
    });

    setDate(formatDateWithTime(lang, publication.publishedAt));
  }, [pathname]);

  return (
    <Container>
      <article className="flex w-full flex-col gap-lg md:gap-xl">
        {!publication.image && publication.heading && (
          <Heading size={"lg"} level={1} className="mb-lg md:mb-xl">
            {publication.heading}
          </Heading>
        )}
        <div className="flex w-full flex-col items-start justify-end gap-xl lg:flex-row-reverse">
          <aside id="sidebar" className="w-full space-y-lg lg:max-w-[296px]">
            {infoSection.map(
              (item, index) =>
                item.value &&
                (item.onlyReuse === isReuse || !item.onlyReuse) && (
                  <div key={`infoSection-${index}`}>
                    <Heading
                      level={2}
                      size="sm"
                      className="mb-md flex text-textSecondary"
                    >
                      {item.icon}
                      {item.title}
                    </Heading>
                    {item.type === "plain" ? (
                      <p className="ml-lg pl-md">{item.value}</p>
                    ) : (
                      <div className="ml-lg pl-md">
                        <span
                          className="button--pink button--xs hover:bg-pink-200"
                          key={index}
                        >
                          {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                ),
            )}
            {isReuse && type.apiAndDataset && type.apiAndDataset.length > 0 ? (
              <div>
                <Heading
                  level={2}
                  size="sm"
                  className="mb-md flex text-textSecondary"
                >
                  <DataIcon className="mr-sm" />
                  API:er och datamängder
                </Heading>
                <ul className="ml-lg flex flex-wrap gap-sm pl-md">
                  {type.apiAndDataset.map((item, index) => (
                    <li key={`apiAndDataset-${index}`} className="flex">
                      {item.link ? (
                        <ButtonLink
                          href={item.link}
                          label={item.title}
                          icon={
                            isExternalLink(item.link)
                              ? ExternalIcon
                              : ArrowRightIcon
                          }
                          iconPosition="right"
                          size={"xs"}
                          variant={"pink"}
                        />
                      ) : (
                        <span className="button--pink button--xs hover:bg-pink-200">
                          {item.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {!isReuse &&
            publication.keywords &&
            publication.keywords.length > 0 ? (
              <div>
                <Heading
                  level={2}
                  size="sm"
                  className="mb-md flex text-textSecondary"
                >
                  <KeywordTagIcon className="mr-sm" />
                  Nyckelord
                </Heading>
                <div className="ml-lg flex flex-wrap gap-sm pl-md">
                  {publication.keywords.map((item, index) => (
                    <span
                      className="button--pink button--xs hover:bg-pink-200"
                      key={index}
                    >
                      {item.value}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {date ? (
              <div>
                <Heading
                  level={2}
                  size="sm"
                  className="mb-md flex text-textSecondary"
                >
                  <DateIcon className="mr-sm" /> Publiceringsdatum
                </Heading>
                <p className="ml-lg pl-md">{date}</p>
              </div>
            ) : null}

            {type.link ? (
              <div>
                <Link
                  target="_blank"
                  href={type.link}
                  className="mb-md flex items-center text-green-600 underline hover:text-textPrimary hover:no-underline md:text-lg"
                >
                  <ExternalIcon className="mr-sm" />
                  Länk till exemplet
                </Link>
              </div>
            ) : null}
          </aside>

          <div
            id="content"
            className="flex w-full max-w-md flex-col space-y-lg md:space-y-xl"
          >
            {!publication.image && publication.preamble && (
              <Preamble>{publication.preamble}</Preamble>
            )}
            {publication.blocks && publication.blocks.length > 0 && (
              <BlockList blocks={publication.blocks} />
            )}
          </div>
        </div>
        {publication.related && publication.related.length > 0 && (
          <GridList
            items={publication.related}
            heading={"Fler " + type.name.toLowerCase()}
          />
        )}
      </article>
    </Container>
  );
};
