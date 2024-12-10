import { Translate } from "next-translate";

import { customIndicators } from "./global";

export const apiexploreBlocks = (t: Translate, iconSize: number) => {
  return [...customIndicators(t, iconSize)];
};
