import { getTranslations } from "next-intl/server";
import type { FC } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ConceptIcon from "@/assets/icons/data.svg";
import DiamondIcon from "@/assets/icons/diamond.svg";
import SpecificationIcon from "@/assets/icons/list-block.svg";
import OrganisationIcon from "@/assets/icons/organisation.svg";
import { ButtonLink } from "@/components/button";
import { CustomImage, type ImageFragment } from "@/components/custom-image";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import type { FragmentType } from "@/graphql/gql";
import type { AddIcon } from "@/types/global";
import { checkLang } from "@/utilities";

import { HeroSearch } from "./hero-search";

interface SearchProps {
  destination: string;
  placeholder: string;
}

interface HeroProps {
  heading?: string | null;
  preamble?: string | null;
  image: FragmentType<typeof ImageFragment> | null;
  search?: SearchProps | null;
  className?: string;
  /**
   * Centers the heading + search block (used on the start page). Callers
   * decide — `<Hero>` no longer reads the pathname, so it stays a pure
   * Server Component.
   */
  isFrontpage?: boolean;
}

interface HeroButtonProps {
  href: string;
  label: string;
  icon: AddIcon;
}

const HeroButton: FC<HeroButtonProps> = ({ href, label, icon }) => {
  const CenterIcon = icon;
  return (
    <ButtonLink
      data-test-id="hero-search-button"
      className="w-full max-w-sm flex-col rounded-md p-lg"
      href={href}
      size="md"
    >
      <CenterIcon />
      <span className="flex flex-row items-center gap-xs">
        {label}
        <ArrowRightIcon className="flex-shrink-0" />
      </span>
    </ButtonLink>
  );
};

/**
 * Presentational hero used on the start page and most CMS pages. Pure
 * by design — no async, no `"use client"` — so it renders as a Server
 * Component. `useTranslations` from `next-intl` works in sync RSCs, so
 * we don't need to push button labels in as props.
 *
 * The shortcut links are static `<ButtonLink>`s — no state, no event
 * handlers — so they live here in the server component. Only the
 * search form (controlled `<SearchInput>` with a conditional clear
 * button) needs a client boundary; that's `<HeroSearch>`.
 */
export async function Hero({
  heading,
  preamble,
  image,
  search,
  className,
  isFrontpage = false,
}: HeroProps) {
  const t = await getTranslations();

  return (
    <section
      id="Hero"
      aria-label="Hero"
      className={`relative flex flex-col justify-center py-2xl ${
        className ? className : ""
      } ${isFrontpage ? "mb-lg md:mb-xl" : ""}`}
    >
      {image && (
        <div className="inset-0 absolute h-full w-full">
          <CustomImage
            width={1920}
            image={image}
            sizes="(max-width: 640px) 90vw, (max-width: 1200px) 90vw, 90vw"
            className="h-full w-full object-cover"
            aria-label="Hero image"
            priority
          />
          <div className="inset-0 absolute top-none h-full w-full bg-blackOpaque3 opacity-10"></div>
        </div>
      )}

      {/* Content on top of the overlay */}
      <Container>
        <div className="relative z-10">
          <div
            className={`${isFrontpage && search ? "text-center" : ""} ${
              search ? "text-brown-100" : "max-w-md bg-white p-xl"
            }`}
          >
            {heading && (
              <Heading
                data-test-id="hero-heading"
                level={1}
                size="lg"
                className={`${
                  isFrontpage ? "mx-auto" : ""
                } mb-none max-w-[700px]`}
              >
                {checkLang(heading)}
              </Heading>
            )}
            {preamble && (
              <Preamble
                className="mx-auto mt-lg max-w-lg"
                color={search ? "light" : "dark"}
              >
                {preamble}
              </Preamble>
            )}
            {search && (
              <div id="SearchHero" className="mt-xl flex flex-col gap-xl">
                <div
                  className={`${
                    isFrontpage ? "justify-center" : "justify-start"
                  } flex flex-wrap gap-md md:gap-lg`}
                >
                  <div className="grid grid-cols-2 gap-md md:gap-lg">
                    <HeroButton
                      href={`/${t("routes.datasets.path")}?q=&f=`}
                      label={t("common.all-data-api")}
                      icon={DiamondIcon}
                    />
                    <HeroButton
                      href={`/${t("routes.specifications.path")}?q=&f=`}
                      label={t("common.specifications")}
                      icon={SpecificationIcon}
                    />
                  </div>
                  <div className="grid grid-cols-2  gap-md md:gap-lg">
                    <HeroButton
                      href={`/${t("routes.concepts.path")}?q=&f=`}
                      label={t("common.all-concepts")}
                      icon={ConceptIcon}
                    />
                    <HeroButton
                      href={`/${t("routes.organisations.path")}?q=&f=`}
                      label={t("common.organisations")}
                      icon={OrganisationIcon}
                    />
                  </div>
                </div>
                <HeroSearch
                  destination={search.destination}
                  placeholder={search.placeholder}
                  isFrontpage={isFrontpage}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
