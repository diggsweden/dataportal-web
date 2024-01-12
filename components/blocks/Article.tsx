import { getFormattedDate, Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { checkLang } from "../../utilities";
import { ImageFragment } from "../../graphql/__generated__/operations";
import { PublicationDataFragment } from "../../graphql/__generated__/operations";
import { findPublicationTypeTag } from "../pages/Articles";
import { LinkFragment as DiggLink } from "../../graphql/__generated__/operations";
import placeholderimg from "../../public/images/noimage.svg";
import NoSsr from "../NoSsr/NoSsr";
import { CustomImage } from "../Image";
import { responsive } from "../../styles/image";

type Article = {
  type: "publication" | "container";
  id?: string;
  date?: string;
  theme?: string;
  title: string;
  description: string;
  slug: string;
  image?: ImageFragment;
  tags?: PublicationDataFragment["tags"];
};

export interface ArticleBlockProps {
  articles: PublicationDataFragment[] | DiggLink[] | any;
  showMoreLink?: DiggLink;
  heading?: string;
  theme?: string;
}

const isPublication = (
  article: PublicationDataFragment | DiggLink,
): article is PublicationDataFragment => {
  return article.__typename === "dataportal_Digg_Publication";
};

const makeArticles = (
  unknownArticles: PublicationDataFragment[] | DiggLink[],
  theme?: string,
): Article[] => {
  return unknownArticles
    ? unknownArticles.map((article) => {
        if (isPublication(article)) {
          return {
            type: "publication",
            id: article.id,
            theme,
            date: article.publishedAt,
            title: article.heading,
            description: article.preamble,
            slug: article.slug,
            image: article.seo?.image || article.image,
            tags: article.tags,
          } as Article;
        } else {
          return {
            type: "container",
            theme: theme,
            title: article.title,
            description: article.description,
            slug: article.slug,
          } as Article;
        }
      })
    : [];
};

/**
 * Block for rendering newslist-items, in blockformat.
 * @param {PublicationDataFragment} articles array of news fetched from apollo gateway
 */
export const ArticleBlock: React.FC<ArticleBlockProps> = ({
  articles: unknownArticles,
  showMoreLink,
  heading,
  theme,
}) => {
  const router = useRouter();
  const { lang } = useTranslation();
  const articles = makeArticles(unknownArticles, theme);

  function getUrl(article: Article) {
    const { slug, type } = article;
    const publicationUrl = `/${showMoreLink?.slug}${slug}`;
    const containerUrl = `${slug}`;
    return type === "publication" ? publicationUrl : containerUrl;
  }

  function handleClick(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    url: string,
  ) {
    e.ctrlKey || e.metaKey ? window.open(url, "_blank") : router.push(url);
  }

  return (
    <div className={"articleblock"}>
      {heading && (
        <Heading level={2} size="lg">
          {heading}
        </Heading>
      )}
      <ul>
        {articles &&
          articles.map((article, index) => {
            const { type, image, theme, date, title, tags } = article;
            const url = getUrl(article);
            const classes = `${type}${theme ? ` ${theme}` : ""}`;
            return (
              <li
                key={index}
                onClick={(e) => handleClick(e, url)}
                className={`${classes}`}
              >
                {image ? (
                  <div className="news-img">
                    <CustomImage
                      image={image}
                      style="fill"
                      sizes={{
                        mobile: "100vw",
                        tablet: "50vw",
                        desktop: "30vw",
                      }}
                    />
                  </div>
                ) : (
                  <div className="news-img">
                    <Image
                      loader={(p) => `${p.src}?w=${p.width}&q=${p.quality}`}
                      style={responsive}
                      src={placeholderimg}
                      alt="placeholder image"
                    />
                  </div>
                )}
                <span className="news-text">
                  <span className="news-top-info text-sm">
                    {tags && <span>{findPublicationTypeTag(tags)?.value}</span>}
                    <NoSsr>
                      {date && <span>{getFormattedDate(date)}</span>}
                    </NoSsr>
                  </span>
                  <Link
                    href={url}
                    locale={lang}
                    className="text-lg font-bold link"
                  >
                    <Heading
                      level={3}
                      className="article-heading text-lg font-bold link"
                    >
                      {checkLang(title)}
                    </Heading>
                  </Link>
                </span>
              </li>
            );
          })}
      </ul>
      {showMoreLink && (
        <Link href={showMoreLink.slug} locale={lang} className="text-md link">
          {showMoreLink.title || showMoreLink.slug}
        </Link>
      )}
    </div>
  );
};
