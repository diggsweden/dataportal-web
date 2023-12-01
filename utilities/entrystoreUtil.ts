/**
 * Search graph for localized value from meta graph
 *
 * value retrieve order:
 * 1. exists in sent in lang
 * 2. exists in fallback lang (en)
 * 3. take first
 *
 * @param metadataGraph
 * @param prop
 * @param lang
 */

export const getLocalizedValue = (
  metadataGraph: any,
  prop: any,
  lang: string,
  options?: { resourceURI?: string },
) => {
  let val = "";
  let fallbackLang = "sv";

  const stmts = metadataGraph.find(options?.resourceURI, prop);
  if (stmts.length > 0) {
    const obj: any = {};
    for (let s = 0; s < stmts.length; s++) {
      obj[stmts[s].getLanguage() || ""] = stmts[s].getValue();
    }

    if (typeof obj[lang] != "undefined") {
      val = obj[lang];
    } else if (obj[fallbackLang] && fallbackLang != lang) {
      val = obj[fallbackLang];
    } else {
      val = Object.entries(obj)[0][1] as string;
    }
  }

  return val;
};

export const getEntryLang = (metadataGraph: any, prop: any, lang: string) => {
  let val = "";
  let fallbackLang = "sv";

  const stmts = metadataGraph.find(null, prop);
  if (stmts.length > 0) {
    const obj: any = {};
    for (let s = 0; s < stmts.length; s++) {
      obj[stmts[s].getLanguage() || ""] = stmts[s].getValue();
    }

    if (typeof obj[lang] != "undefined") {
      val = lang;
    } else {
      val = fallbackLang;
    }
  }

  return val;
};
