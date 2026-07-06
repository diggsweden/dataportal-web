import type { FC } from "react";

import type { ToolDataFragment } from "@/graphql/gql/graphql";

import {
  PublicationTeaser,
  type PublicationTeaserItem,
} from "./publication-teaser";
import { ToolTeaser } from "./tool-teaser";

export type { PublicationTeaserItem } from "./publication-teaser";
export { PublicationTeaser } from "./publication-teaser";
export { ToolTeaser } from "./tool-teaser";

export type TeaserItem = PublicationTeaserItem | ToolDataFragment;

interface TeaserProps {
  item: TeaserItem;
}

/**
 * Renders the right teaser variant for a list item. Tools get the
 * interactive `ToolTeaser`; every other publication type renders the
 * server-rendered `PublicationTeaser`.
 */
export const Teaser: FC<TeaserProps> = ({ item }) => {
  if (item.__typename === "dataportal_Digg_Tool") {
    return <ToolTeaser tool={item} />;
  }

  return <PublicationTeaser publication={item} />;
};
