import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AppRouterProviders } from "@/components/providers";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <AppRouterProviders locale={locale} messages={messages}>
      {children}
    </AppRouterProviders>
  );
}
