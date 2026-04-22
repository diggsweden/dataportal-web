import { exploreApiLink, keyword, theme, customIndicators } from "./global";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translate = (_key: string, ..._args: any[]) => string;

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
