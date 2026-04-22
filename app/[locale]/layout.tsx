import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { routing } from "@/lib/i18n/routing";
import { MediaUrlProvider } from "@/providers/media-url-provider";
import { ResourceLabelsProvider } from "@/providers/resource-labels-provider";
import { getNavigationData } from "@/utilities/query-helpers";

import { AppShell } from "./app-shell";

import "@/styles/main.css";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!routing.locales.includes(locale as "sv" | "en")) {
    notFound();
  }

  const [messages, navResult, resourceLabels] = await Promise.all([
    getMessages(),
    getNavigationData("all"),
    import(`@/locales/${locale}/resources.json`).then((m) => m.default),
  ]);

  const navigationData =
    navResult?.props?.items?.find(
      (nav: { locale?: string }) => nav.locale === locale,
    ) ?? null;

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://editera.dataportal.se" />
        <link rel="preconnect" href="https://admin.dataportal.se" />
        <meta name="theme-color" content="#FBF2F0" />
        <script src="/__ENV.js" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MediaUrlProvider
            baseUrl={process.env.REACT_APP_MEDIA_BASE_URL || ""}
          >
            <ResourceLabelsProvider labels={resourceLabels}>
              <AppShell navigationData={navigationData}>{children}</AppShell>
            </ResourceLabelsProvider>
          </MediaUrlProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
