import reactEnv from "@beam-australia/react-env";

interface Options {
  prodOnly?: boolean;
}

interface generateCSPProps {
  nonce?: string;
}

/**
 * @param options nonce: string
 * @returns A string with multiple CSP directives and corresponding values
 */
const generateCSP = ({ nonce }: generateCSPProps = {}) => {
  const policy: Partial<Record<CSPDirective, string[]>> = {};

  /**
   * ads a directive to the CSP
   * @param directive ex style-src
   * @param value dirctive value, ex 'self' https://example.com
   * @param options {prodOnly: boolean}
   * @returns A CSP directive and value
   */
  const add = (
    directive: CSPDirective,
    value: string,
    options: Options = {},
  ) => {
    if (options.prodOnly && process.env.NODE_ENV === "development") return;
    /** eslint-disable */
    // console.log({ directive, value });
    const curr = policy[directive];
    policy[directive] = curr ? [...curr, value] : [value];
  };

  const scriptSrc = `'self' ${
    nonce ? `'nonce-${nonce}'` : ""
  } 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' https://webbanalys.digg.se https://webbanalys-dashboard.digg.se *.entryscape.com *.dataportal.se *.beta.dataportal.digikube.dgstage.se *.dataportal.dev1.se 'report-sample' https://webbanalys-dashboard.digg.se/js/container_hV6fNi9j_preview.js https://webbanalys.digg.se/js/container_hV6fNi9j.js`;

  add("default-src", `'self'`, { prodOnly: true });
  add("manifest-src", `'self'`, { prodOnly: true });
  add("object-src", `'none'`, { prodOnly: true });
  add("script-src", scriptSrc, { prodOnly: false });

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
    `'self' data: https://static.entryscape.com https://static.cdn.entryscape.com`,
  );
  add("base-uri", `'self' https://webbanalys-dashboard.digg.se/`);
  add("manifest-src", `'self'`);
  add("form-action", `'self'`);
  add(
    "img-src",
    `'self' ${
      reactEnv("IMAGE_DOMAIN") || ""
    } https://diggdrstoragetest.blob.core.windows.net/ data: *`,
  );
  add(
    "media-src",
    `'self' ${reactEnv("IMAGE_DOMAIN") || ""} https: data: blob:`,
  );
  add(
    "style-src",
    `'self' 'unsafe-inline' https://cdn.screen9.com/players/amber-player.css`,
  );
  add(
    "style-src-elem",
    `'self' 'unsafe-inline' https://cdn.screen9.com/players/amber-player.css`,
  );
  add("style-src-attr", `'self' 'unsafe-inline'`);
  add(
    "connect-src",
    `'self' https://* http://127.0.0.1:1300/ https://admin.dataportal.se https://editera.dataportal.se https://webbanalys.digg.se ${
      reactEnv("APOLLO_URL") || ""
    } https://* webbanalys.digg.se webbanalys-dashboard.digg.se statsapi.screen9.com`,
  );

  // Return the object in a formatted value
  return Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
};

export default generateCSP;
