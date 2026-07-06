/**
 * Builds the client-side env object consumed by `@beam-australia/react-env`.
 * Mirrors the output of the `react-env` CLI (`public/__ENV.js`).
 */
export function getBrowserEnv(): Record<string, string | undefined> {
  const prefix = process.env.REACT_ENV_PREFIX || "REACT_APP";

  return Object.keys(process.env)
    .filter((key) => new RegExp(`^${prefix}_`, "i").test(key))
    .reduce<Record<string, string | undefined>>((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
}

/** Script body that sets `window.__ENV` before client hydration. */
export function buildInlineEnvScriptBody(): string {
  const payload = JSON.stringify(getBrowserEnv()).replace(/</g, "\\u003c");
  return `window.__ENV=${payload};`;
}
