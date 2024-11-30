declare module "fetch-enhanced" {
  import { RequestInfo, RequestInit, Response } from "node-fetch";
  function fetchEnhanced(
    fetch: typeof fetch,
  ): (_url: RequestInfo, _init?: RequestInit) => Promise<Response>;
  export default fetchEnhanced;
}
