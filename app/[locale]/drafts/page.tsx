import { notFound } from "next/navigation";

import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import {
  getGoodExample,
  getMultiContainer,
  getNewsItem,
  getRootAggregate,
} from "@/utilities";

import { DraftClient } from "./client";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string };
  searchParams: { slug?: string; secret?: string; type?: string };
};

const getQuery = async (
  slug: string,
  locale: string,
  secret: string,
  type: string,
) => {
  if (type === "news-item") {
    return await getNewsItem(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
      revalidate: false,
    });
  }

  if (type === "good-example") {
    return await getGoodExample(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
      revalidate: false,
    });
  }

  switch (slug) {
    case "/":
      return await getRootAggregate(locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    default:
      return await getMultiContainer([slug.substring(1)], locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
  }
};

export default async function DraftPage({ params, searchParams }: Props) {
  const { locale } = params;
  const slug = searchParams?.slug || "";
  const secret = searchParams?.secret || "";
  const type = searchParams?.type || "";

  const result = await getQuery(slug, locale || "sv", secret, type);

  if ("notFound" in result && result.notFound) {
    notFound();
  }

  if (!("props" in result)) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DraftClient {...(result.props as any)} />;
}
