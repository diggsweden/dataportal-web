import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getForm,
  getModule,
} from "@/app/[locale]/(content)/fortroendemodellen/data";
import { FormPage } from "@/components/form/form-page";
import { isAppLocale } from "@/i18n/routing";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Förtroendemodellen utveckling - Sveriges Dataportal",
    description:
      'Vid genomförande av delen "Utveckling" kan en märkning fås, som kan användas utåt för att visa att förtroendemodellen använts.',
  };
}

export default async function UtvecklingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const [form, mod] = await Promise.all([
    getForm("fortroendemodellen", locale),
    getModule("fortroende-generate-text", locale),
  ]);

  if (!form?.elements) notFound();

  return (
    <FormPage {...form} elements={form.elements} module={mod?.blocks ?? null} />
  );
}
