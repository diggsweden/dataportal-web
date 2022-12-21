import { getFormattedDate, Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { checkLang } from "../../utilities/checkLang";
import { MediaType_dataportal_Digg_Image } from "../../graphql/__generated__/MediaType";
import {
  Publication_dataportal_Digg_Publications,
  Publication_dataportal_Digg_Publications_tags,
} from "../../graphql/__generated__/Publication";
import { findPublicationTypeTag } from "../pages/Articles";
import { Link as DiggLink } from "../../graphql/__generated__/Link";
import { handleUrl } from "./Media";
import placeholderimg from "../../public/images/noimage.svg";
import { responsive } from "../../styles/image";
import NoSsr from "../NoSsr/NoSsr";

type Article = {
  type: "publication" | "container";
  id?: string;
  date?: string;
  theme?: string;
  title: string;
  description: string;
  slug: string;
  image?: MediaType_dataportal_Digg_Image;
  tags?: Publication_dataportal_Digg_Publications_tags[];
};
export interface ArticleBlockProps {
  articles: Publication_dataportal_Digg_Publications[] | DiggLink[];
  showMoreLink?: DiggLink;
  heading?: string;
  theme?: string;
}

const isPublication = (
  article: Publication_dataportal_Digg_Publications | DiggLink
): article is Publication_dataportal_Digg_Publications => {
  return article.__typename === "dataportal_Digg_Publication" ? true : false;
};

const makeArticles = (
  unknownArticles: Publication_dataportal_Digg_Publications[] | DiggLink[],
  theme?: string
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
 * @param {Publication_dataportal_Digg_Publications} articles array of news fetched from apollo gateway
 */
export const ArticleBlock: React.FC<ArticleBlockProps> = ({
  articles: unknownArticles,
  showMoreLink,
  heading,
  theme,
}) => {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const articles = makeArticles(unknownArticles, theme);

  function getUrl(article: Article) {
    const { slug, type } = article;
    const publicationUrl = `/aktuellt${slug}`;
    const containerUrl = `${slug}`;
    return type === "publication" ? publicationUrl : containerUrl;
  }

  function handleClick(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    url: string
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
            const { type, image, theme, date, title, description, tags } =
              article;
            const url = getUrl(article);
            const imageUrl = image && handleUrl(image);
            const classes = `${type}${theme ? ` ${theme}` : ""}`;
            return (
              <li
                key={index}
                onClick={(e) => handleClick(e, url)}
                className={`${classes}`}
              >
                {image ? (
                  <div className="news-img">
                    <Image
                      src={imageUrl || ""}
                      alt={image?.alt || ""}
                      sizes="100%"
                      fill
                    />
                  </div>
                ) : (
                  <div className="news-img">
                    <Image
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
                  {/* <p className="text-md truncate-4">{checkLang(description)}</p> */}
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
