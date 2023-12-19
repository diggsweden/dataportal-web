// import useTranslation from "next-translate/useTranslation";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import React from "react";
// import { checkLang } from "@/utilities";
// import { ImageFragment } from "@/graphql/__generated__/operations";
// import { PublicationDataFragment } from "@/graphql/__generated__/operations";
// import { findPublicationTypeTag } from "../Publication";
// import { LinkFragment as DiggLink } from "@/graphql/__generated__/operations";
// import placeholderimg from "@/public/images/noimage.svg";
// import NoSsr from "@/components/NoSsr/NoSsr";
// import { CustomImage } from "@/components/Image";

// type Article = {
//   type: "publication" | "container";
//   id?: string;
//   date?: string;
//   theme?: string;
//   title: string;
//   description: string;
//   slug: string;
//   image?: ImageFragment;
//   tags?: PublicationDataFragment["tags"];
// };

// export interface ArticleBlockProps {
//   articles: PublicationDataFragment[] | DiggLink[] | any;
//   showMoreLink?: DiggLink;
//   heading?: string;
//   theme?: string;
// }

// const isPublication = (
//   article: PublicationDataFragment | DiggLink,
// ): article is PublicationDataFragment => {
//   return article.__typename === "dataportal_Digg_Publication";
// };

// const makeArticles = (
//   unknownArticles: PublicationDataFragment[] | DiggLink[],
//   theme?: string,
// ): Article[] => {
//   return unknownArticles
//     ? unknownArticles.map((article) => {
//         if (isPublication(article)) {
//           return {
//             type: "publication",
//             id: article.id,
//             theme,
//             date: article.publishedAt,
//             title: article.heading,
//             description: article.preamble,
//             slug: article.slug,
//             image: article.seo?.image || article.image,
//             tags: article.tags,
//           } as Article;
//         } else {
//           return {
//             type: "container",
//             theme: theme,
//             title: article.title,
//             description: article.description,
//             slug: article.slug,
//           } as Article;
//         }
//       })
//     : [];
// };

// /**
//  * Block for rendering newslist-items, in blockformat.
//  * @param {Publication_dataportal_Digg_Publications} articles array of news fetched from apollo gateway
//  */
// export const ArticleBlock: React.FC<ArticleBlockProps> = ({
//   articles: unknownArticles,
//   showMoreLink,
//   heading,
//   theme,
// }) => {
//   const router = useRouter();
//   const { lang } = useTranslation();
//   const articles = makeArticles(unknownArticles, theme);

//   function getUrl(article: Article) {
//     const { slug, type } = article;
//     const publicationUrl = `/aktuellt${slug}`;
//     const containerUrl = `${slug}`;
//     return type === "publication" ? publicationUrl : containerUrl;
//   }

//   function handleClick(
//     e: React.MouseEvent<HTMLLIElement, MouseEvent>,
//     url: string,
//   ) {
//     e.ctrlKey || e.metaKey ? window.open(url, "_blank") : router.push(url);
//   }

//   return (
//     <div className={"articleblock"}>
//       {heading && <h2>{heading}</h2>}
//       <ul>
//         {/* {articles &&
//           articles.map((article, index) => {
//             const { type, image, theme, date, title, tags } = article;
//             const url = getUrl(article);
//             const classes = `${type}${theme ? ` ${theme}` : ""}`;
//             return (
//               <li
//                 key={index}
//                 onClick={(e) => handleClick(e, url)}
//                 className={`${classes}`}
//               >
//                 {image ? (
//                   <div className="news-img">
//                     <CustomImage
//                       image={image}
//                       style="fill"
//                       sizes={{
//                         mobile: "100vw",
//                         tablet: "50vw",
//                         desktop: "30vw",
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <div className="news-img">
//                     <Image
//                       loader={(p) => `${p.src}?w=${p.width}&q=${p.quality}`}
//                       src={placeholderimg}
//                       alt="placeholder image"
//                     />
//                   </div>
//                 )}
//                 <span className="">
//                   <span className="">
//                     {tags && <span>{findPublicationTypeTag(tags)?.value}</span>}
//                     <NoSsr>{date && <span>{date}</span>}</NoSsr>
//                   </span>
//                   <Link href={url} locale={lang} className="">
//                     <h3 className="">{checkLang(title)}</h3>
//                   </Link>
//                 </span>
//               </li>
//             );
//           })} */}
//       </ul>
//       {showMoreLink && (
//         <Link href={showMoreLink.slug} locale={lang} className="">
//           {showMoreLink.title || showMoreLink.slug}
//         </Link>
//       )}
//     </div>
//   );
// };

import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { checkLang } from "@/utilities";
import { ImageFragment } from "@/graphql/__generated__/operations";
import { PublicationDataFragment } from "@/graphql/__generated__/operations";
import { findPublicationTypeTag } from "../Publication";
import { LinkFragment as DiggLink } from "@/graphql/__generated__/operations";
import placeholderimg from "@/public/images/noimage.svg";
import NoSsr from "@/components/NoSsr/NoSsr";
import { CustomImage } from "@/components/Image";
import LinkArrow from "@/assets/icons/linkArrow.svg";
export const PublicationTeaser = ({ publication }: any) => {
  const { createdAt, tags, heading, slug, image } = publication;
  const { t } = useTranslation();

  function getHref(tag: string) {
    const cleanString = tag.toLowerCase().replace(/\s/g, "");
    switch (cleanString) {
      case "nyhet":
        return `nyheter${slug}`;
        break;
      case "godaexempel":
        return `goda-exempel${slug}`;
        break;
      default:
        return "";
        break;
    }
  }

  const href = tags[0].value;
  function getDate(date: string) {
    const parsedDate = new Date(date);
    return parsedDate.getDay();
  }

  return (
    <article>
      <CustomImage style="h-[184px] w-full" image={image !== null && image} />
      <div className="flex flex-col px-md py-lg">
        <div>
          <span>{getDate(createdAt)} Juni 2023</span>|
          <span>
            {tags[0]?.value ? tags[0].value : t("pages|listpage$fallback-tag")}
          </span>
        </div>
        <span className="pb-md pt-sm">{heading}</span>
        <div className="flex items-center gap-xs">
          <Link href={getHref(href)}>Läs mer</Link>
          <LinkArrow />
        </div>
      </div>
    </article>
  );
};
