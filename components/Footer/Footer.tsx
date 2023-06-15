import { Container, css, DiggLogo } from "@digg/design-system";
import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { dataportal_LinkType } from "../../graphql/__generated__/globalTypes";
import { ExternalLink, IPuff } from "../Navigation";
import Image from "next/image";
import euLogo from "../../public/images/eu.png";

const columns = (
  t: Translate
): { title: string; links: IPuff[] | DiggLink[] }[] => [
  {
    title: "Dataportal",
    links: [
      {
        __typename: "dataportal_Digg_Link",
        title: t("routes|about-website$title") || "",
        link: t("routes|about-website$path"),
        linktype: dataportal_LinkType.INTERNAL,
        description: null,
      },
      {
        __typename: "dataportal_Digg_Link",
        title: "info@digg.se",
        link: "mailto:info@digg.se",
        linktype: dataportal_LinkType.EXTERNAL,
        description: null,
      },
    ],
  },
];

const IsDIGGLink = (link: IPuff | DiggLink): link is DiggLink => {
  return (link as DiggLink).__typename === "dataportal_Digg_Link";
};

export const Footer: React.FC = () => {
  const { t, lang } = useTranslation("common");
  return (
    <footer className="footer">
      <div className="footer__mobile-bar">
        <span className="footer__mobile-links">
          <Link href={`/${lang}/faq`} key={"faq-link"} locale={lang}>
            <span className="footer__search-link">
              <svg
                width="16"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 14.5C4.41563 14.5 1.5 11.5841 1.5 8C1.5 4.41594 4.41563 1.5 8 1.5C11.5844 1.5 14.5 4.41594 14.5 8C14.5 11.5841 11.5844 14.5 8 14.5ZM8 10.5C7.4375 10.5 7 10.9375 7 11.5C7 12.0625 7.40938 12.5 8 12.5C8.53438 12.5 9 12.0625 9 11.5C9 10.9375 8.53438 10.5 8 10.5ZM9.03438 4H7.4375C6.21875 4 5.25 4.96875 5.25 6.1875C5.25 6.59375 5.59375 6.9375 6 6.9375C6.40625 6.9375 6.75 6.59375 6.75 6.1875C6.75 5.8125 7.03438 5.5 7.40938 5.5H9.00625C9.40938 5.5 9.75 5.8125 9.75 6.1875C9.75 6.4375 9.625 6.62813 9.40625 6.75313L7.625 7.84375C7.375 8 7.25 8.25 7.25 8.5V9C7.25 9.40625 7.59375 9.75 8 9.75C8.40625 9.75 8.75 9.40625 8.75 9V8.9375L10.1594 8.0625C10.8156 7.65625 11.2219 6.9375 11.2219 6.1875C11.25 4.96875 10.2812 4 9.03438 4Z"
                  fill="#949494"
                />
              </svg>
              FAQ
            </span>
          </Link>

          <Link
            href={`https://community.dataportal.se/`}
            key={"community-link"}
            lang="en"
          >
            <span className="footer__search-link">
              <svg
                width="20"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 0C10.0906 0 13 2.4625 13 5.5C13 8.5375 10.0906 11 6.5 11C5.91563 11 5.35 10.9281 4.80937 10.8062C3.85312 11.4 2.47281 12 0.779688 12C0.467813 12 0.185312 11.8156 0.0630625 11.5281C-0.05925 11.2406 -0.000231251 10.9094 0.210594 10.6844C0.226875 10.6719 0.918125 9.91875 1.42906 8.93437C0.536875 7.99375 0 6.8 0 5.5C0 2.4625 2.91031 0 6.5 0ZM5.14375 9.31563C5.6 9.44688 6.05625 9.5 6.5 9.5C9.25625 9.5 11.5 7.70625 11.5 5.5C11.5 3.29375 9.25625 1.5 6.5 1.5C3.74375 1.5 1.5 3.29375 1.5 5.5C1.5 6.6 2.05344 7.4125 2.51781 7.90312L3.25312 8.68125L2.75969 9.62813C2.64812 9.81563 2.52281 10.0594 2.39219 10.2656C2.94563 10.1062 3.49062 9.85938 4.02187 9.50313L4.54375 9.20625L5.14375 9.31563ZM13.8 4.00625C17.25 4.1375 20 6.54688 20 9.5C20 10.8 19.4625 11.9937 18.5719 12.9344C19.0812 13.9187 19.7719 14.6719 19.7906 14.6844C20 14.9094 20.0594 15.2406 19.9094 15.5281C19.8156 15.8156 19.5312 16 19.2188 16C17.5281 16 16.1469 15.4 15.1906 14.8062C14.65 14.9281 14.0844 15 13.5 15C10.9375 15 8.72188 13.7437 7.6625 11.9219C8.20312 11.85 8.72188 11.7281 9.21562 11.5594C10.0906 12.7219 11.6844 13.5 13.5 13.5C13.9438 13.5 14.4 13.4469 14.8562 13.3156L15.4563 13.2063L15.9781 13.5031C16.5094 13.8594 17.0531 14.1062 17.6094 14.2656C17.4781 14.0594 17.3531 13.8156 17.2406 13.6281L16.7469 12.6812L17.4813 11.9031C17.9469 11.4156 18.5 10.6 18.5 9.5C18.5 7.42812 16.5219 5.72188 13.9719 5.51875L14 5.5C14 4.98438 13.9313 4.48438 13.8 4.00625Z"
                  fill="#949494"
                />
              </svg>
              Community
            </span>
          </Link>
        </span>
      </div>
      <Container
        cssProp={css`
          max-width: calc(100% - 2rem);
          margin: auto;
        `}
      >
        <div className="footer-main">
          <div className="footer__links">
            <div className="footer__links-nav footer__links-nav-v2">
              {columns(t)?.map((col, index) => (
                <div key={col.title + index} className="footer__column">
                  <ul key={col.title + index}>
                    {col.links.map((l, index) => {
                      const { slug, type, isMail } = IsDIGGLink(l)
                        ? {
                            slug: l.link,
                            type: l.linktype,
                            isMail: l.title === "info@digg.se",
                          }
                        : {
                            slug: l.slug,
                            type: dataportal_LinkType.INTERNAL,
                            isMail: l.title === "info@digg.se",
                          };

                      return (
                        <li key={index}>
                          {type === dataportal_LinkType.INTERNAL ? (
                            <Link href={slug} className="text-md">
                              {l?.title}
                            </Link>
                          ) : (
                            <ExternalLink
                              href={slug}
                              isMail={isMail}
                              className="text-md"
                            >
                              {l?.title}
                            </ExternalLink>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="digg__">
            <p className="text-sm">{t("common|digg-managed_text")}</p>
            <div className="footer__logos">
              <div className="footer__logos-digg">
                <DiggLogo
                  title={t("common|digg-logo_text")}
                  id="footer"
                  mode="wide"
                  width={30 * 16}
                />
              </div>
              <Image src={euLogo} alt="" width={200} />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
