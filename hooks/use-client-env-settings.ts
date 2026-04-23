"use client";

import { useEffect, useState } from "react";

import { type EnvSettings, SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";

/**
 * Builds `EnvSettings` on the client (matches `pages/_app` sandbox vs prod logic)
 * and applies the per-request CSP nonce when provided.
 */
export function useClientEnvSettings(
  cspNonce?: string | null,
): EnvSettings | null {
  const [env, setEnv] = useState<EnvSettings | null>(null);

  useEffect(() => {
    const isSandbox = window.location.host.includes("sandbox");
    const nextEnv = isSandbox ? new Settings_Sandbox() : SettingsUtil.create();
    if (cspNonce) {
      nextEnv.nonce = cspNonce;
    }
    setEnv(nextEnv);
  }, [cspNonce]);

  return env;
}
