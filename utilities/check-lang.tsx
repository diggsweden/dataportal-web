import { NextRouter } from "next/router";
import { ReactNode } from "react";

import i18n from "@/i18n";

export interface IHeading {
  lang: string;
  node: ReactNode;
}

const en = "{en:";

/**
 * Checks if string or part of string is language marked in the format {en:example text}
 * and return strings for swedish parts and <span lang="en">-element for english
 *
 * @param {string} text
 */
export const checkLang = (text: string | null) => {
  if (text && text.includes(en)) {
    const splitLanguageParts = (text: string) => {
      const arr = [];
      let index = 1;
      while (text.length > 0 && index < 25) {
        const swedishPhraze = text.indexOf(en) != 0 ? true : false;
        arr.push(
          swedishPhraze ? (
            text.substring(
              0,
              text.includes(en) ? text.indexOf(en) : text.length,
            )
          ) : (
            <span key={index} lang={"en"}>
              {text.substring(4, text.indexOf("}"))}
            </span>
          ),
        );
        text = text.slice(
          text.includes(en)
            ? text.indexOf(swedishPhraze ? en : "}") + (swedishPhraze ? 0 : 1)
            : text.length,
          text.length,
        );
        index++;
      }
      return arr;
    };

    const str = text ? text : "";
    const languageMarked = splitLanguageParts(str).map((subElement) => {
      return subElement;
    });

    return languageMarked;
  } else {
    return text;
  }
};

export const includeLangInPath = (lang: string) => {
  return lang === i18n.defaultLocale ? "" : `/${lang}`;
};

export const handleLocale = (
  pathname: string,
  currentLocale: string,
  currentPath: string,
  router: NextRouter,
) => {
  if (
    currentLocale === i18n.defaultLocale &&
    pathname.startsWith(`/${currentLocale}/`)
  ) {
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }
};

export const parseLanguageMarkup = (heading: string) => {
  return heading.split(/(\{en:\s*[^}]+\})/g).map((headingSplit, index) => {
    const match = headingSplit.match(/\{en:\s*([^}]+)\}/);
    return match ? (
      <span key={index} lang="en" dir="ltr">
        {match[1]}
      </span>
    ) : (
      headingSplit
    );
  });
};
