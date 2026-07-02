import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  if (!REVALIDATE_SECRET) {
    return Response.json(
      { message: "No REVALIDATE_SECRET configured" },
      { status: 500 },
    );
  }

  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tags: unknown = body.tags;

    if (!Array.isArray(tags) || tags.length === 0) {
      return Response.json(
        { message: "Body must include a non-empty `tags` array" },
        { status: 400 },
      );
    }

    for (const tag of tags) {
      if (typeof tag === "string") {
        revalidateTag(tag, "default");
      }
    }

    return Response.json({ revalidated: tags });
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
