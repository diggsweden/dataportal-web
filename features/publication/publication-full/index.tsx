import { FC, useContext, useEffect, useState } from "react";
import { BlockList } from "@/components/blocks/block-list";
import {
  GoodExampleResponse,
  isExternalLink,
  linkBase,
  NewsItemResponse,
  slugify,
} from "@/utilities";
import { Container } from "@/components/layout/container";
import { GridList } from "@/components/grid-list";
import { formatDateWithTime } from "@/utilities/date-helper";
import { Heading } from "@/components/typography/heading";
import DateIcon from "@/assets/icons/date.svg";
import GoodExampleIcon from "@/assets/icons/godaExempel.svg";
import DataIcon from "@/assets/icons/data.svg";
import ExternalIcon from "@/assets/icons/external-link.svg";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import KeywordsIcon from "@/assets/icons/keywords.svg";
import useTranslation from "next-translate/useTranslation";
import { highlightCode } from "@/features/pages/container-page";
import { usePathname } from "next/navigation";
import { SettingsContext } from "@/providers/settings-provider";
import { Preamble } from "@/components/typography/preamble";
import { ButtonLink } from "@/components/button";

export const PublicationFull: FC<NewsItemResponse | GoodExampleResponse> = ({
  ...publication
}) => {
  const type =
    publication.__typename === "dataportal_Digg_News_Item"
      ? { name: "Nyheter", publisher: null, apiAndDataset: null }
      : {
          name: "Goda Exempel",
          publisher: publication.publisher,
          apiAndDataset: publication.apiAndDataset,
        };

  const { t, lang } = useTranslation();
  const pathname = usePathname();
  const { setBreadcrumb } = useContext(SettingsContext);
  const [date, setDate] = useState("");

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

    setBreadcrumb &&
      setBreadcrumb({
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
            {type.publisher ? (
              <div>
                <Heading
                  level={2}
                  size="sm"
                  className="mb-md flex text-textSecondary"
                >
                  <GoodExampleIcon className="mr-sm" />
                  Avsändare
                </Heading>
                <p className="ml-lg pl-md">{type.publisher}</p>
              </div>
            ) : null}

            {type.apiAndDataset && type.apiAndDataset.length > 0 ? (
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

            <div>
              <Heading
                level={2}
                size="sm"
                className="mb-md flex text-textSecondary"
              >
                <DateIcon className="mr-sm" />
                {t("common|published-date")}
              </Heading>
              <p className="ml-lg pl-md">{date}</p>
            </div>

            {publication.keywords && publication.keywords.length > 0 ? (
              <div>
                <Heading
                  level={2}
                  size="sm"
                  className="mb-md flex text-textSecondary"
                >
                  <KeywordsIcon className="mr-sm" />
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
