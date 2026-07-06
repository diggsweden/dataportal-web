import type { NextRequest } from "next/server";
import { NewsItemDocument } from "@/app/[locale]/(content)/(publications)/nyheter/data";
import { gqlFetch } from "@/graphql/fetcher";

/**
 * Liveness / readiness probe. Verifies GraphQL connectivity by running a
 * cheap news query. Called by the Docker HEALTHCHECK directive and the
 * k8s liveness probe with `?secret=${HEALTHCHECK_SECRET}`.
 *
 * `force-dynamic` is redundant here (we read `searchParams`), but we set
 * it explicitly so refactors that drop the secret check don't accidentally
 * let Next cache a stale `pass` / `fail` response.
 */
export const dynamic = "force-dynamic";

const HEALTHCHECK_SECRET = process.env.HEALTHCHECK_SECRET;

export async function GET(req: NextRequest) {
  if (!HEALTHCHECK_SECRET) {
    return Response.json(
      { message: "No HEALTHCHECK_SECRET environment variable found" },
      { status: 401 },
    );
  }

  if (req.nextUrl.searchParams.get("secret") !== HEALTHCHECK_SECRET) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    await gqlFetch(NewsItemDocument, {
      filter: { limit: 3 },
    });

    return Response.json(
      { status: "pass" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ status: "fail" }, { status: 500 });
  }
}
