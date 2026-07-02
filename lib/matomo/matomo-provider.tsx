"use client";

import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import { MatomoScript } from "./matomo-script";
import { usePageViews } from "./use-page-views";

export interface MatomoContextValue {
  /** True when the Matomo script is mounted and tracking is live. */
  enabled: boolean;
  /** User consent flag (from cookie banner). Persisted by the caller. */
  consent: boolean;
  setConsent: Dispatch<SetStateAction<boolean>>;
}

const MatomoContext = createContext<MatomoContextValue>({
  enabled: false,
  consent: false,
  setConsent: () => {},
});

export const useMatomo = () => useContext(MatomoContext);

export interface MatomoProviderProps {
  children?: ReactNode;
  /**
   * Hard disable — skip the loader regardless of consent. Use for env flags
   * (`NEXT_PUBLIC_DISABLE_MATOMO=1`) and non-production hosts (sandbox).
   */
  disabled: boolean;
  /** Initial consent value, typically read from persisted cookie settings. */
  initialConsent: boolean;
  /** CSP nonce applied to the injected `<script>` tag. */
  nonce?: string;
}

export const MatomoProvider: FC<MatomoProviderProps> = ({
  children,
  disabled,
  initialConsent,
  nonce,
}) => {
  const [consent, setConsent] = useState(initialConsent);
  const enabled = !disabled && consent;

  const value = useMemo<MatomoContextValue>(
    () => ({ enabled, consent, setConsent }),
    [enabled, consent],
  );

  usePageViews(enabled);

  return (
    <MatomoContext.Provider value={value}>
      {enabled && <MatomoScript nonce={nonce} />}
      {children}
    </MatomoContext.Provider>
  );
};
