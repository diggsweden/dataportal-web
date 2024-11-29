import { FC, useState } from "react";
import { Heading } from "@/components/typography/heading";
import { checkLang } from "@/utilities";
import useTranslation from "next-translate/useTranslation";
import { CustomImage } from "@/components/custom-image";
import { ImageFragment } from "@/graphql/__generated__/operations";
import { Container } from "@/components/layout/container";
import { useRouter } from "next/router";
import { SearchInput } from "@/features/search/search-input";
import { Preamble } from "@/components/typography/preamble";
import { ButtonLink } from "@/components/button";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";

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
            className={`${isFrontpage && search && "mx-auto text-center"} ${
              search ? "text-brown-100" : "bg-white p-xl"
            } max-w-md`}
          >
            {heading && (
              <Heading level={1} size="lg" className="mb-none">
                {checkLang(heading)}
              </Heading>
            )}
            {preamble && (
              <Preamble className="mt-lg" color={search ? "light" : "dark"}>
                {preamble}
              </Preamble>
            )}
            {search && (
              <div id="SearchHero" className="mt-xl">
                <form
                  className="datapage-form"
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
                <div
                  className={`${
                    isFrontpage ? "" : "md:justify-start"
                  } md mt-lg flex flex-wrap justify-center gap-md md:flex-row`}
                >
                  <ButtonLink
                    href={`/datasets?q=&f=`}
                    label={t("common|all-data-api")}
                    size="sm"
                    locale={lang}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                  <ButtonLink
                    href={`/concepts?q=&f=`}
                    label={t("common|all-concepts")}
                    size="sm"
                    locale={lang}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                  <ButtonLink
                    href={`/specifications?q=&f=`}
                    label={t("common|all-specs")}
                    size="sm"
                    locale={lang}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
