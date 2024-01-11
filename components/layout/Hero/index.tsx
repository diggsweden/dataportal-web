import { FC, useState } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { checkLang } from "@/utilities";
import useTranslation from "next-translate/useTranslation";
import { CustomImage } from "@/components/global/CustomImage";
import { ImageFragment } from "@/graphql/__generated__/operations";
import { Container } from "@/components/layout/Container";
import { useRouter } from "next/router";
import { SearchInput } from "@/components/content/Search/SearchInput";
import { Preamble } from "@/components/global/Typography/Preamble";
import { ButtonLink } from "@/components/global/Button";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";

interface HeroProps {
  heading?: string | null;
  preamble?: string | null;
  image: ImageFragment | null;
  search?: SearchProps | null;
}

interface SearchProps {
  destination: string;
  placeholder: string;
}

export const Hero: FC<HeroProps> = ({ heading, preamble, image, search }) => {
  const { pathname } = useRouter();
  const { t, lang } = useTranslation();
  const isFrontpage = pathname === "/";
  const [query, setQuery] = useState("");

  return (
    <div id="Hero" className="relative flex flex-col justify-center py-2xl">
      {image && (
        <div className="absolute left-none top-none h-full w-full">
          <CustomImage image={image} className="h-full w-full object-cover" />
        </div>
      )}
      <Container>
        <div className="relative z-10">
          <div
            className={`${isFrontpage && search && "mx-auto text-center"} 
            ${search ? "text-brown-100" : "bg-white p-xl"} max-w-md`}
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
                >
                  <SearchInput
                    id="start-search"
                    placeholder={search.placeholder}
                    query={query}
                    setQuery={setQuery}
                  />
                </form>
                <div
                  className={`${
                    isFrontpage && "justify-center"
                  } mt-lg flex space-x-md `}
                >
                  <ButtonLink
                    href={`${lang}/datasets?q=&f=`}
                    label={t("common|all-data-api")}
                    size="sm"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                  <ButtonLink
                    href={`/${lang}/concepts?q=&f=`}
                    label={t("common|all-concepts")}
                    size="sm"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                  <ButtonLink
                    href={`/${lang}/specifications?q=&f=`}
                    label={t("common|all-specs")}
                    size="sm"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
