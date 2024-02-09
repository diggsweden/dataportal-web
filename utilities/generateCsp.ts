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

  add("default-src", `'self'`, { prodOnly: true });
  add("manifest-src", `'self'`, { prodOnly: true });
  add("object-src", `'none'`, { prodOnly: true });
  add(
    "script-src",
    `'self' ${
      nonce ? `'nonce-${nonce}'` : ""
    } 'strict-dynamic' 'unsafe-eval' 'unsafe-inline' https://webbanalys.digg.se *.entryscape.com *.dataportal.se`,
    { prodOnly: true },
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
    `'self' data: https://static.entryscape.com https://static.cdn.entryscape.com`,
  );
  add("base-uri", `'self'`);
  add("manifest-src", `'self'`);
  add("form-action", `'self'`);
  add(
    "img-src",
    `'self' ${
      process.env.IMAGE_DOMAIN || ""
    } https://diggdrstoragetest.blob.core.windows.net/ data: *`,
  );
  add(
    "media-src",
    `'self' ${process.env.IMAGE_DOMAIN || ""} https: data: blob:`,
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
    `'self' https://* http://127.0.0.1:1300/ ${reactEnv("APOLLO_URL") || ""}`,
  );

  // return the object in a formatted value (this won't work on IE11 without a polyfill!)
  return Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
};

export default generateCSP;
