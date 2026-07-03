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
    title: "Förtroende inför utveckling - Sveriges Dataportal",
    description:
      "Några utgångspunkter att fundera på då ni ska starta upp ett AI-projekt.",
  };
}

export default async function InforUtvecklingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getModule("fortroende-infor-utveckling", locale);
  if (!data?.blocks) notFound();

  return <FortroendeModulePage {...data} />;
}
