import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FortroendeIntroPage } from "@/app/[locale]/(content)/fortroendemodellen/_components/fortroende-intro-page";
import { getModule } from "@/app/[locale]/(content)/fortroendemodellen/data";
import { isAppLocale } from "@/i18n/routing";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Förtroendemodellen - Sveriges Dataportal",
    description:
      "Förtroendemodellen för artificiell intelligens (AI) är ett verktyg för självutvärdering av användningen av AI hos aktörer inom offentlig sektor.",
  };
}

export default async function FortroendemodellenPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getModule("fortroendemodellen", locale);
  if (!data?.blocks) notFound();

  return <FortroendeIntroPage {...data} />;
}
