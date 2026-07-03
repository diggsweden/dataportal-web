import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { FortroendeModulePage } from "@/features/fortroendemodellen/fortroende-module-page";
import { isAppLocale } from "@/i18n/routing";
import { getModule } from "@/utilities/query-helpers";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Förtroende uppföljning - Sveriges Dataportal",
    description:
      "Uppföljning av AI-system som är i drifttagna så förtroende för systemet bibehålls.",
  };
}

export default async function UppfoljningPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getModule("fortroende-uppfoljning", locale);
  if (!data?.blocks) notFound();

  return <FortroendeModulePage {...data} />;
}
