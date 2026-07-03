import { headers } from "next/headers";

import type { EnvSettings } from "@/env";
import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";

/**
 * Per-request EntryStore environment. Entryscape routes serve sandbox data on
 * the `*sandbox*` host, so the settings are picked from the request host rather
 * than the build-time `RUNTIME_ENV` (`SettingsUtil.create()`).
 */
export async function getEntryscapeEnv(): Promise<{
  env: EnvSettings;
  isSandbox: boolean;
}> {
  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = { ...(isSandbox ? new Settings_Sandbox() : new Settings_Prod()) };

  return { env, isSandbox };
}

/**
 * Splits an EntryStore `cid_eid` slug into its context id and entry id. The
 * entry id is always the last segment; anything before it is the context id
 * (matches `resolveEntryStoreRoute`, so context ids containing `_` survive).
 */
export function splitEntryId(id: string | string[] | undefined): {
  cid: string;
  eid: string;
} {
  const ids = (typeof id === "string" && id.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return { cid, eid };
}
