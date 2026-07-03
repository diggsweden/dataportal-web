import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FortroendeModulePage } from "@/app/[locale]/(content)/fortroendemodellen/components/fortroende-module-page";
import { getModule } from "@/app/[locale]/(content)/fortroendemodellen/data";
import { isAppLocale } from "@/i18n/routing";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

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
