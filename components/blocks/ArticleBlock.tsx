import { getFormattedDate, Container, Heading } from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { News_dataportal_v1_Digg_News } from '../../graphql/__generated__/News';
import { slugify } from '../../utilities';
import { checkLang } from '../../utilities/checkLang';
import { imageLoader } from './MediaBlock';
import env from '@beam-australia/react-env';
import { PuffBlock_puffs } from '../../graphql/__generated__/PuffBlock';
import { MediaType_dataportal_v1_Digg_Image } from '../../graphql/__generated__/MediaType';
import { Link as DiggLink } from '../../graphql/__generated__/Link';
import { MainContainerStyle } from '../../styles/general/emotion';

type Article = {
  type: 'news' | 'container';
  cardType: string;
  id?: string;
  date?: string;
  theme?: string;
  title: string;
  description: string;
  slug: string;
  image?: MediaType_dataportal_v1_Digg_Image;
  buttonText?: string;
};
export interface ArticleBlockProps {
  articles: News_dataportal_v1_Digg_News[] | PuffBlock_puffs[];
  showMoreLink?: DiggLink;
  heading?: string;
  theme?: string;
}

const isNews = (
  article: News_dataportal_v1_Digg_News | PuffBlock_puffs
): article is News_dataportal_v1_Digg_News => {
  return (article as any).id ? true : false;
};

const makeArticles = (
  unknownArticles: News_dataportal_v1_Digg_News[] | PuffBlock_puffs[],
  theme?: string
): Article[] => {
  return unknownArticles
    ? unknownArticles.map((article) => {
        if (isNews(article)) {
          return {
            type: 'news',
            id: article.id,
            theme,
            cardType: 'article',
            date: article.publishedAt,
            title: article.heading,
            description: article.preamble,
            slug: article.slug,
            image: article.image,
          } as Article;
        } else {
          return {
            type: 'container',
            id: article.container?.id,
            theme: theme || article.theme,
            title: article.heading || article.container?.title,
            description: article.description || article.container?.description,
            slug: article.link?.link || article.container?.slug,
            image: article.container?.image,
            buttonText: article.buttonText,
            cardType: article.type,
          } as Article;
        }
      })
    : [];
};

/**
 * Block for rendering newslist-items, in blockformat.
 * @param {News_dataportal_v1_Digg_News} articles array of news fetched from apollo gateway
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
    const { id, title, slug, type } = article;
    const newsUrl = `/${lang}/${t('routes|news$path')}/${id}/${slugify(title)}`;
    const containerUrl = `/${lang}${slug}`;
    return type === 'news' ? newsUrl : containerUrl;
  }

  function handleClick(url: string) {
    router.push(url);
  }

  return (
    <div className={'articleblock'}>
      {heading && (
        <Heading
          level={2}
          size="lg"
        >
          {heading}
        </Heading>
      )}
      <ul>
        {articles &&
          Object.values(articles).map((article, index) => {
            const { cardType, buttonText, image, theme, date, title, description } = article;
            const url = getUrl(article);
            const imageUrl = image?.url || '';
            const width = image?.width || '';
            const classes = `${cardType}${theme ? ` ${theme}` : ''}`;
            return (
              <li
                key={index}
                onClick={cardType === 'article' ? () => handleClick(url) : undefined}
                className={classes}
              >
                {image && cardType === 'article' && (
                  <div className="news-img">
                    <Image
                      loader={() =>
                        imageLoader((env('MEDIA_BASE_URL') || '') + imageUrl, width as number)
                      }
                      src={(env('MEDIA_BASE_URL') || '') + imageUrl}
                      width={width || ''}
                      alt={image?.alt || ''}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="news-text">
                  {date && (
                    <span className="text-base news-text--date">{getFormattedDate(date)}</span>
                  )}
                  {cardType === 'article' ? (
                    <Link
                      href={url}
                      locale={lang}
                    >
                      <a className="text-lg font-bold link">{checkLang(title)}</a>
                    </Link>
                  ) : (
                    <p className="text-xl news-text--heading">{title}</p>
                  )}
                  <p className="text-md truncate-4">{checkLang(description)}</p>
                </div>
                {buttonText && (
                  <Link
                    href={url}
                    locale={lang}
                  >
                    <a className={`btn-link btn-link--${theme === 'darkTheme' ? 'light' : 'dark'}`}>
                      {buttonText}
                    </a>
                  </Link>
                )}
              </li>
            );
          })}
      </ul>
      {showMoreLink && (
        <Link
          href={showMoreLink.link}
          locale={lang}
        >
          <a className="text-md link">{showMoreLink.title || showMoreLink.link}</a>
        </Link>
      )}
    </div>
  );
};
