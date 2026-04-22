import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Auth Required.", {
    status: 401,
    headers: {
      "WWW-authenticate": 'Basic realm="Secure Area"',
    },
  });
}
