import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  type GoodExampleResponse,
  getGoodExample,
} from "@/app/[locale]/(content)/(publications)/(examples)/data";
import { PublicationFull } from "@/app/[locale]/(content)/(publications)/components/publication-full";
import {
  getNewsItem,
  type NewsItemResponse,
} from "@/app/[locale]/(content)/(publications)/nyheter/data";
import { ContainerPage } from "@/app/[locale]/(content)/[...containerSlug]/components/container-page";
import { LandingPage } from "@/app/[locale]/(content)/[...containerSlug]/components/landing-page";
import {
  getMultiContainer,
  type MultiContainerResponse,
} from "@/app/[locale]/(content)/[...containerSlug]/data";
import { Dataportal_ContainerState } from "@/graphql/gql/graphql";
import { type AppLocale, isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";

import { getRootAggregate, type RootAggregateResponse } from "./data";

type DraftPageProps =
  | MultiContainerResponse
  | RootAggregateResponse
  | NewsItemResponse
  | GoodExampleResponse;

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

function RenderDraft(props: DraftPageProps & { locale: AppLocale }) {
  switch (props.type) {
    case "RootAggregate":
      return <ContainerPage {...props} />;
    case "MultiContainer": {
      const { container, related } = props as MultiContainerResponse;
      if (!container) return null;
      return container.landingPage ? (
        <LandingPage
          {...container}
          locale={props.locale}
          pathname={`${includeLangInPath(props.locale)}/drafts`}
        />
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

  return <RenderDraft {...(result as DraftPageProps)} locale={locale} />;
}
