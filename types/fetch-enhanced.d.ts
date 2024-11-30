declare module "fetch-enhanced" {
  import { RequestInfo, RequestInit, Response } from "node-fetch";
  function fetchEnhanced(
    fetch: typeof fetch,
    // eslint-disable-next-line no-unused-vars
  ): (url: RequestInfo, init?: RequestInit) => Promise<Response>;
  export default fetchEnhanced;
}
