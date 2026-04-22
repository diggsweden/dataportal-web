import { notFound } from "next/navigation";

import { getMultiContainer, MultiContainerResponse } from "@/utilities";

import { ContainerPageClient } from "./client";

type Props = { params: { locale: string; containerSlug: string[] } };

export const dynamic = "force-dynamic";

export default async function Page({ params }: Props) {
  const { locale, containerSlug } = params;
  const result = await getMultiContainer(containerSlug, locale);
  if ("notFound" in result && result.notFound) notFound();
  if (!("props" in result)) notFound();
  return <ContainerPageClient {...(result.props as MultiContainerResponse)} />;
}
