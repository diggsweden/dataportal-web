import { customIndicators } from "./global";
import { Translate } from "next-translate";

export const apiexploreBlocks = (t: Translate, iconSize: number) => {
  return [...customIndicators(t, iconSize)];
};
