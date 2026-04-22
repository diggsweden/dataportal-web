import { NextResponse } from "next/server";

import {
  NewsItemQuery,
  NewsItemQueryVariables,
} from "@/graphql/__generated__/operations";
import { client } from "@/graphql/client";
import { NEWS_ITEM_QUERY } from "@/graphql/publicationQuery";

const HEALTHCHECK_SECRET = process.env.HEALTHCHECK_SECRET;

/**
 * API for performing health checks, will try to run the startpage query
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Check to see that there is a secret set as env variable HEALTHCHECK_SECRET.
  if (!HEALTHCHECK_SECRET) {
    return NextResponse.json(
      { message: "No HEALTHCHECK_SECRET environment variable found" },
      { status: 401 },
    );
  }

  // Check for secret to confirm this is a valid request
  if (searchParams.get("secret") !== HEALTHCHECK_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    //perform request to start page query
    const result = await client.query<NewsItemQuery, NewsItemQueryVariables>({
      query: NEWS_ITEM_QUERY,
      variables: {
        filter: { limit: 3 },
      },
      fetchPolicy: "no-cache",
    });

    if (result && result.error) {
      return NextResponse.json({ status: "fail" }, { status: 500 });
    }

    return NextResponse.json(
      { status: "pass" },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "fail" }, { status: 500 });
  }
}
