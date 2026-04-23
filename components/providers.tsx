"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

/** App Router client i18n boundary. Pages Router keeps using `next-translate` in `_app`. */
export function AppRouterProviders({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
