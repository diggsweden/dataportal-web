import { customIndicators } from "./global";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translate = (_key: string, ..._args: any[]) => string;

export const apiexploreBlocks = (t: Translate, iconSize: number) => {
  return [...customIndicators(t, iconSize)];
};
