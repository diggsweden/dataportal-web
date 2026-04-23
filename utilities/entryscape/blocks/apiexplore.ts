import type { Translate } from "@/i18n/types";
import { customIndicators } from "./global";

export const apiexploreBlocks = (t: Translate, iconSize: number) => {
  return [...customIndicators(t, iconSize)];
};
