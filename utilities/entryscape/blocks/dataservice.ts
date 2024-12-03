import { exploreApiLink, keyword, theme, customIndicators } from "./global";
import { Translate } from "next-translate";

export const dataserviceBlocks = (
  t: Translate,
  iconSize: number,
  lang: string,
  cid: string,
  eid: string,
) => {
  return [
    ...customIndicators(t, iconSize),
    ...exploreApiLink(lang, cid, eid, t),
    keyword(t),
    theme(t),
  ];
};
