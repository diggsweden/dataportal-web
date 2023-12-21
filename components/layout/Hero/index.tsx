import React, { FC } from "react";
import Heading from "@/components/global/Typography/Heading";
import { checkLang } from "@/utilities";
import { CustomImage } from "@/components/global/CustomImage";
import { ImageFragment } from "@/graphql/__generated__/operations";
import Container from "@/components/layout/Container";

interface HeroProps {
  heading: string | null;
  preamble?: string | null;
  image: ImageFragment | null;
}

export const Hero: FC<HeroProps> = ({ heading, preamble, image }) => (
  <div id="Hero" className="relative mb-xl flex flex-col justify-center py-2xl">
    {image && (
      <div className="absolute left-none top-none h-full w-full">
        <CustomImage image={image} className="h-full w-full object-cover" />
      </div>
    )}
    <Container>
      <div className="relative z-10 max-w-md bg-white p-xl">
        {heading && (
          <Heading level={1} size="lg" className="mb-lg">
            {checkLang(heading)}
          </Heading>
        )}
        {preamble && <div className="text-textSecondary">{preamble}</div>}
      </div>
    </Container>
  </div>
);
