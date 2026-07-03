import type { CSPDirective } from "@/types/global";

interface Options {
  prodOnly?: boolean;
}

interface GenerateCSPProps {
  /**
   * Per-request CSP nonce. Stamped into `script-src` alongside
   * `'strict-dynamic'` so modern browsers gate script execution by
   * nonce match, not by the `'self'` / host allowlist. Omit only in
   * tests — a missing nonce makes the policy unusable in production.
   */
  nonce?: string;
  /**
   * Value of the `IMAGE_DOMAIN` runtime env (via `@beam-australia/react-env`
   * at the call site). Passed in explicitly rather than read from
   * `process.env` inside here so the generator stays callable from edge
   * middleware without pulling `react-env`'s resolver into the edge bundle.
   */
  imageDomain?: string;
  /** Same rationale as `imageDomain` but for `APOLLO_URL` (connect-src). */
  apolloUrl?: string;
}

/**
 * Builds a single-line `Content-Security-Policy` string. Pure; no env reads.
 * Caller (e.g. `proxy.ts`) is responsible for resolving runtime env values
 * and passing them in.
 */
const generateCSP = ({
  nonce,
  imageDomain = "",
  apolloUrl = "",
}: GenerateCSPProps = {}) => {
  const policy: Partial<Record<CSPDirective, string[]>> = {};

  const add = (
    directive: CSPDirective,
    value: string,
    options: Options = {},
  ) => {
    if (options.prodOnly && process.env.NODE_ENV === "development") return;
    const curr = policy[directive];
    policy[directive] = curr ? [...curr, value] : [value];
  };

  add("default-src", `'self'`, { prodOnly: true });
  add("manifest-src", `'self'`, { prodOnly: true });
  add("object-src", `'none'`, { prodOnly: true });
  add(
    "script-src",
    `'self' ${
      nonce ? `'nonce-${nonce}'` : ""
    } 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' https://webbanalys.digg.se https://webbanalys-dashboard.digg.se *.entryscape.com *.dataportal.se *.beta.dataportal.digikube.dgstage.se *.dataportal.dev1.se`,
    { prodOnly: true },
  );
  add(
    "script-src-elem",
    `'self' 'unsafe-inline' dataportal.se *.dataportal.se https://webbanalys.digg.se https://webbanalys-dashboard.digg.se https://entrystore.org/js/4.15.0-dev/entrystore.js *.entryscape.com static.cdn.entryscape.com https://cdn.screen9.com/players/amber-player.js`,
    { prodOnly: false },
  );
  add(
    "script-src-attr",
    `'unsafe-hashes' 'sha256-dYUMUtU0sGsXCiI6XuVhMNdPUHRSW7RGVl5bz5LjpAI=' 'sha256-VBX8ceLcK+xMdfMO8F4EoCjmT8IQqXqmpv70AnAzpAc='`,
  );
  add(
    "font-src",
    `'self' https://static.entryscape.com https://static.cdn.entryscape.com`,
  );
  add(
    "font-src",
    `'self' data: https://static.entryscape.com https://static.cdn.entryscape.com https://webbanalys-dashboard.digg.se`,
  );
  add("base-uri", `'self' https://webbanalys-dashboard.digg.se`);
  add("manifest-src", `'self'`);
  add("form-action", `'self'`);
  add(
    "img-src",
    `'self' ${imageDomain} https://diggdrstoragetest.blob.core.windows.net/ data: *`,
  );
  add("media-src", `'self' ${imageDomain} https: data: blob:`);
  add(
    "style-src",
    `'self' 'unsafe-inline' https://cdn.screen9.com/players/amber-player.css https://webbanalys-dashboard.digg.se`,
  );
  add(
    "style-src-elem",
    `'self' 'unsafe-inline' https://cdn.screen9.com/players/amber-player.css https://webbanalys-dashboard.digg.se`,
  );
  add("style-src-attr", `'self' 'unsafe-inline'`);
  add(
    "connect-src",
    `'self' https://* http://127.0.0.1:1300/ https://admin.dataportal.se https://editera.dataportal.se https://webbanalys.digg.se ${apolloUrl} https://* webbanalys.digg.se statsapi.screen9.com geo-inspire.trafikverket.se`,
  );

  return Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
};

export default generateCSP;
