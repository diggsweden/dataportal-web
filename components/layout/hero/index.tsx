import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useState } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ConceptIcon from "@/assets/icons/data.svg";
import DiamondIcon from "@/assets/icons/diamond.svg";
import SpecificationIcon from "@/assets/icons/list-block.svg";
import OrganisationIcon from "@/assets/icons/organisation.svg";
import { ButtonLink } from "@/components/button";
import { CustomImage } from "@/components/custom-image";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { SearchInput } from "@/features/search/search-input";
import { ImageFragment } from "@/graphql/__generated__/operations";
import { AddIcon } from "@/types/global";
import { checkLang } from "@/utilities";

interface HeroProps {
  heading?: string | null;
  preamble?: string | null;
  image: ImageFragment | null;
  search?: SearchProps | null;
  className?: string;
}

interface SearchProps {
  destination: string;
  placeholder: string;
}

interface HeroButtonProps {
  href: string;
  label: string;
  lang: string;
  icon: AddIcon;
}

const HeroButton = ({ href, label, lang, icon }: HeroButtonProps) => {
  const CenterIcon = icon;
  return (
    <ButtonLink
      className="w-full max-w-sm flex-col rounded-md p-lg"
      href={href}
      size="md"
      locale={lang}
    >
      <CenterIcon />
      <span className="flex flex-row items-center gap-xs">
        {label}
        <ArrowRightIcon className="flex-shrink-0" />
      </span>
    </ButtonLink>
  );
};

export const Hero: FC<HeroProps> = ({
  heading,
  preamble,
  image,
  search,
  className,
}) => {
  const { pathname } = useRouter();
  const { t, lang } = useTranslation();
  const isFrontpage = pathname === "/";
  const [query, setQuery] = useState("");

  return (
    <section
      id="Hero"
      aria-label="Hero"
      className={`relative flex flex-col justify-center py-2xl ${
        className ? className : ""
      }`}
    >
      {image && (
        <div className="inset-0 absolute h-full w-full">
          <CustomImage
            width={1920}
            image={image}
            sizes="(max-width: 640px) 90vw, (max-width: 1200px) 90vw, 90vw"
            className="h-full w-full object-cover"
            aria-label="Hero image"
            priority={true}
          />
          <div className="inset-0 absolute top-none h-full w-full bg-blackOpaque3 opacity-10"></div>
        </div>
      )}

      {/* Content on top of the overlay */}
      <Container>
        <div className="relative z-10">
          <div
            className={`${isFrontpage && search && "text-center"} ${
              search ? "text-brown-100" : "bg-white p-xl"
            }`}
          >
            {heading && (
              <Heading
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
                      href={`/datasets?q=&f=`}
                      label={t("common|all-data-api")}
                      lang={lang}
                      icon={DiamondIcon}
                    />

                    <HeroButton
                      href={`/specifications?q=&f=`}
                      label={t("common|specifications")}
                      lang={lang}
                      icon={SpecificationIcon}
                    />
                  </div>
                  <div className="grid grid-cols-2  gap-md md:gap-lg">
                    <HeroButton
                      href={`/concepts?q=&f=`}
                      label={t("common|all-concepts")}
                      lang={lang}
                      icon={ConceptIcon}
                    />

                    <HeroButton
                      href={`/organisations?q=&f=`}
                      label={t("common|organisations")}
                      lang={lang}
                      icon={OrganisationIcon}
                    />
                  </div>
                </div>
                <form
                  className={`datapage-form w-full max-w-md ${
                    isFrontpage ? "mx-auto" : "justify-start"
                  }`}
                  method="GET"
                  action={search.destination}
                  role={"search"}
                >
                  <SearchInput
                    id="start-search"
                    placeholder={search.placeholder}
                    query={query}
                    setQuery={setQuery}
                    ariaLabel={search.placeholder}
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
