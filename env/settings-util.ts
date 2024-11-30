import env from "@beam-australia/react-env";

import { EnvSettings } from "./env-settings";
import { Settings_Dev } from "./settings.dev";
import { Settings_Prod } from "./settings.prod";
import { Settings_Sandbox } from "./settings.sandbox";
import { Settings_Test } from "./settings.test";

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
      this.current = this.getDefault();
      console.log("Missing runtimeconfig, creating default");
    }

    return SettingsUtil.current;
  }

  /**
   * Retrieves/creates runtime settings from runtime arguments, eg container start env
   *
   */
  public static create(): EnvSettings {
    let envName = env("RUNTIME_ENV") || "prod"; //always default to prod

    switch (envName) {
      case "dev":
        SettingsUtil.current = new Settings_Dev();
        break;
      case "test":
        SettingsUtil.current = new Settings_Test();
        break;
      case "stage":
        SettingsUtil.current = new Settings_Prod();
        break;
      case "sandbox":
        SettingsUtil.current = new Settings_Sandbox();
        break;
      default:
        SettingsUtil.current = new Settings_Prod();
        break;
    }

    return SettingsUtil.current;
  }

  /**
   * Creates default runtime env config (dev)
   */
  public static getDefault(): EnvSettings {
    this.current = new Settings_Dev();

    return this.current;
  }
}
