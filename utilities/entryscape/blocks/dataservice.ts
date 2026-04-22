import type { Translate } from "next-translate";

import { customIndicators, exploreApiLink, keyword, theme } from "./global";

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
