import React, { FC } from "react";
import Heading from "@/components/global/Typography/Heading";
import { checkLang } from "@/utilities";
import { CustomImage } from "@/components/global/CustomImage";
import { ImageFragment } from "@/graphql/__generated__/operations";
import Container from "@/components/layout/Container";
import { useRouter } from "next/router";
import { SearchInput } from "@/components/global/Form/SearchInput";
import { Preamble } from "@/components/global/Typography/Preamble";

interface HeroProps {
  heading: string | null;
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
  const isFrontpage = pathname === "/";

  return (
    <div
      id="Hero"
      className="relative mb-xl flex flex-col justify-center py-2xl"
    >
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
              <Heading level={1} size="lg" className="mb-lg">
                {checkLang(heading)}
              </Heading>
            )}
            {preamble && (
              <Preamble color={search ? "light" : "dark"}>{preamble}</Preamble>
            )}
            {search && (
              <div id="SearchHero" className="mt-xl">
                <form
                  className="datapage-form"
                  method="GET"
                  action={search.destination}
                >
                  <label className="sr-only" htmlFor="start-search">
                    {search.placeholder}
                  </label>
                  <SearchInput
                    id="start-search"
                    placeholder={search.placeholder}
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
