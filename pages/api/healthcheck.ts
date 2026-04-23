import type { NextApiRequest, NextApiResponse } from "next";

import type {
  NewsItemQuery,
  NewsItemQueryVariables,
} from "../../graphql/__generated__/operations";
import { gqlFetch } from "../../graphql/fetcher";
import { NEWS_ITEM_QUERY } from "../../graphql/publicationQuery";

const HEALTHCHECK_SECRET = process.env.HEALTHCHECK_SECRET;

/**
 * API for performing health checks, will try to run the news query.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!HEALTHCHECK_SECRET) {
    return res
      .status(401)
      .json({ message: "No HEALTHCHECK_SECRET environment variable found" });
  }

  if (HEALTHCHECK_SECRET && req.query.secret !== HEALTHCHECK_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await gqlFetch<NewsItemQuery, NewsItemQueryVariables>(NEWS_ITEM_QUERY, {
      filter: { limit: 3 },
    });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ status: "pass" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "fail" });
  }
}
