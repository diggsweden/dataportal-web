import env from "@beam-australia/react-env";

import type { EnvSettings } from "./env-settings";
import { Settings_Dev } from "./settings.dev";
import { Settings_Prod } from "./settings.prod";
import { Settings_Sandbox } from "./settings.sandbox";

/**
 * Utility for non secret application runtime settings.
 *
 * Prefer this over .env-files to minimize number of builds of the App in our pipeline
 */
export class SettingsUtil {
  //Singleton pattern
  private static current: EnvSettings;

  private constructor() {}

  /**
   * Retrieves runtime settings, if none retrieves default
   *
   */
  public static getCurrent(): EnvSettings {
    if (!SettingsUtil.current) {
      SettingsUtil.current = SettingsUtil.getDefault();
      console.warn("Missing runtimeconfig, creating default");
    }

    return SettingsUtil.current;
  }

  /**
   * Retrieves/creates runtime settings from runtime arguments, eg container start env
   *
   */
  public static create(): EnvSettings {
    SettingsUtil.current = SettingsUtil.fromEnvName(
      env("RUNTIME_ENV") || "prod",
    );
    return SettingsUtil.current;
  }

  /**
   * Maps a runtime env name to its settings instance. Pure — does not touch the
   * singleton, so it is safe to call per-request during SSR.
   */
  public static fromEnvName(envName: string): EnvSettings {
    switch (envName) {
      case "dev":
        return new Settings_Dev();
      case "stage":
        return new Settings_Prod();
      case "sandbox":
        return new Settings_Sandbox();
      default:
        return new Settings_Prod();
    }
  }

  /**
   * Resolves the runtime env NAME for a request. A `*sandbox*` host always wins
   * (sandbox is selectable purely via the URL, e.g. `sandbox.localhost:3000` or
   * `sandbox.dev.beta…`), otherwise falls back to the build-time `RUNTIME_ENV`,
   * then prod. Pass the request `Host` header on the server.
   */
  public static resolveEnvName(host?: string): string {
    if (host?.includes("sandbox")) return "sandbox";
    return env("RUNTIME_ENV") || "prod"; //always default to prod
  }

  /**
   * Creates default runtime env config (dev)
   */
  public static getDefault(): EnvSettings {
    SettingsUtil.current = new Settings_Dev();

    return SettingsUtil.current;
  }
}
