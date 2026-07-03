/**
 * Basic-auth challenge endpoint. Always returns `401 WWW-Authenticate`
 * regardless of method so a CDN / edge gate can use it as a realm stub.
 *
 * Marked `force-dynamic` because Next will otherwise try to prerender
 * a Route Handler with no dynamic reads.
 */
export const dynamic = "force-dynamic";

function challenge(): Response {
  return new Response("Auth Required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export {
  challenge as GET,
  challenge as POST,
  challenge as PUT,
  challenge as PATCH,
  challenge as DELETE,
  challenge as HEAD,
  challenge as OPTIONS,
};
