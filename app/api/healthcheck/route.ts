import { type NextRequest, NextResponse } from "next/server";

import type {
  NewsItemQuery,
  NewsItemQueryVariables,
} from "@/graphql/__generated__/operations";
import { gqlFetch } from "@/graphql/fetcher";
import { NEWS_ITEM_QUERY } from "@/graphql/publicationQuery";

const HEALTHCHECK_SECRET = process.env.HEALTHCHECK_SECRET;

/**
 * API for performing health checks; runs the same news query as the legacy
 * `pages/api/healthcheck` handler.
 */
export async function GET(request: NextRequest) {
  if (!HEALTHCHECK_SECRET) {
    return NextResponse.json(
      { message: "No HEALTHCHECK_SECRET environment variable found" },
      { status: 401 },
    );
  }

  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== HEALTHCHECK_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    await gqlFetch<NewsItemQuery, NewsItemQueryVariables>(NEWS_ITEM_QUERY, {
      filter: { limit: 3 },
    });

    const res = NextResponse.json({ status: "pass" });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "fail" }, { status: 500 });
  }
}
