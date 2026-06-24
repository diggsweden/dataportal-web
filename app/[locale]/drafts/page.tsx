import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import { PublicationFull } from "@/features/publication/publication-full";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import { isAppLocale } from "@/i18n/routing";
import {
  type DataportalPageProps,
  getGoodExample,
  getMultiContainer,
  getNewsItem,
  getRootAggregate,
  type MultiContainerResponse,
} from "@/utilities";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slug?: string; secret?: string; type?: string }>;
}

async function getQuery(
  slug: string,
  locale: string,
  secret: string,
  type: string,
) {
  if (type === "news-item") {
    return await getNewsItem(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
    });
  }

  if (type === "good-example") {
    return await getGoodExample(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
    });
  }

  switch (slug) {
    case "/":
      return await getRootAggregate(locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
      });
    default:
      return await getMultiContainer([slug.substring(1)], locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
      });
  }
}

function RenderDraft(props: DataportalPageProps) {
  switch (props.type) {
    case "RootAggregate":
      return <ContainerPage {...props} />;
    case "MultiContainer": {
      const { container, related } = props as MultiContainerResponse;
      if (!container) return null;
      return container.landingPage ? (
        <LandingPage {...container} />
      ) : (
        <ContainerPage {...container} related={related} />
      );
    }
    case "Publication":
      return <PublicationFull {...props} />;
    default:
      return null;
  }
}

export default async function DraftsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { slug = "", secret = "", type = "" } = await searchParams;

  const result = await getQuery(slug, locale, secret, type);

  if (!result) {
    notFound();
  }

  return <RenderDraft {...(result as DataportalPageProps)} />;
}
