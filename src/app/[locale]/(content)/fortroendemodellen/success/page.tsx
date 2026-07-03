import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FortroendeEndPage } from "@/app/[locale]/(content)/fortroendemodellen/components/fortroende-end-page";
import { getModule } from "@/app/[locale]/(content)/fortroendemodellen/data";
import { isAppLocale } from "@/i18n/routing";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tack för att du slutförde förtroendemodellen - Sveriges Dataportal",
    description:
      "För att visa upp att ni deltagit så kan ni visa upp förtroendemärkningen på er hemsida.",
    robots: { index: false, follow: false },
  };
}

export default async function SuccessPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getModule("fortroende-end-text", locale);
  if (!data?.blocks) notFound();

  return <FortroendeEndPage {...data} />;
}
