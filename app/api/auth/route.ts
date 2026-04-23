import { NextResponse } from "next/server";

function authRequired() {
  return new NextResponse("Auth Required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const GET = authRequired;
export const POST = authRequired;
export const PUT = authRequired;
export const PATCH = authRequired;
export const DELETE = authRequired;
