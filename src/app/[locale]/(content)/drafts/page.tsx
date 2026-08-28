import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PublicationFull } from "@/app/[locale]/(content)/(publications)/_components/publication-full";
import {
  type GoodExampleResponse,
  getGoodExample,
} from "@/app/[locale]/(content)/(publications)/(examples)/data";
import {
  getNewsItem,
  type NewsItemResponse,
} from "@/app/[locale]/(content)/(publications)/nyheter/data";
import { ContainerPage } from "@/app/[locale]/(content)/[...containerSlug]/_components/container-page";
import { LandingPage } from "@/app/[locale]/(content)/[...containerSlug]/_components/landing-page";
import {
  getMultiContainer,
  type MultiContainerResponse,
} from "@/app/[locale]/(content)/[...containerSlug]/data";
import { mediaTypeToImage } from "@/components/custom-image";
import { PageShell } from "@/components/layout/page-shell";
import { ParentFragment } from "@/graphql/fragments";
import { getFragmentData } from "@/graphql/gql";
import { Dataportal_ContainerState } from "@/graphql/gql/graphql";
import { type AppLocale, isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
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
      return await getMultiContainer(
        slug.replace(/^\//, "").split("/").filter(Boolean),
        locale,
        {
          state: Dataportal_ContainerState.Preview,
          secret,
        },
      );
  }
}

function publicationParent(
  publication: NewsItemResponse | GoodExampleResponse,
) {
  if (publication.__typename === "dataportal_Digg_News_Item") {
    return { name: "Nyheter", link: "/nyheter" };
  }

  return (publication as GoodExampleResponse).reuse
    ? {
        name: "Exempel på återanvändning",
        link: "/exempel-pa-ateranvandning",
      }
    : {
        name: "Goda Exempel",
        link: "/exempel-datadriven-transformation",
      };
}

function RenderDraft(props: DraftPageProps & { locale: AppLocale }) {
  switch (props.type) {
    case "RootAggregate":
      return (
        <PageShell
          heading={props.heading}
          preamble={props.preamble}
          image={mediaTypeToImage(props.image) ?? undefined}
          breadcrumb={buildBreadcrumb(props.heading ?? "", [])}
          search
        >
          <ContainerPage {...props} />
        </PageShell>
      );
    case "MultiContainer": {
      const { container, related } = props as MultiContainerResponse;
      if (!container) return null;

      const parentData = getFragmentData(ParentFragment, container.parent);
      const parentCrumbs =
        parentData?.heading && parentData.slug
          ? [{ name: parentData.heading, link: parentData.slug }]
          : [];
      const slug = (container.slug ?? "").replace(/^\//, "");
      const isSearchPage = slug === "data-apier" || slug === "data-apis";

      return (
        <PageShell
          heading={container.heading}
          preamble={isSearchPage ? null : container.preamble}
          image={mediaTypeToImage(container.image) ?? undefined}
          breadcrumb={buildBreadcrumb(container.heading ?? "", parentCrumbs)}
          search={isSearchPage}
        >
          {container.landingPage ? (
            <LandingPage
              {...container}
              locale={props.locale}
              pathname={`${includeLangInPath(props.locale)}/drafts`}
            />
          ) : (
            <ContainerPage
              {...container}
              related={related?.filter(
                (item): item is NonNullable<typeof item> => item !== null,
              )}
            />
          )}
        </PageShell>
      );
    }
    case "Publication": {
      const image = mediaTypeToImage(props.image) ?? undefined;
      return (
        <PageShell
          heading={props.heading}
          preamble={props.preamble}
          image={image}
          breadcrumb={buildBreadcrumb(props.heading ?? "", [
            publicationParent(props),
          ])}
        >
          <PublicationFull {...props} />
        </PageShell>
      );
    }
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
