import { FC, useEffect, useState } from "react";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { highlightCode } from "@/components/content/ContainerPage";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import { BlockList } from "@/components/content/blocks/BlockList";
import Image from "next/image";
import fortroendemodellImage from "@/assets/logos/fortroendemodellen.png";

export const FortroendeEndPage: FC<ModuleDataFragment> = ({ blocks }) => {
  const [heading, setHeading] = useState<string | null>(null);

  const getHeading = () => {
    if (blocks[0].__typename === "dataportal_Digg_Text") {
      let str = blocks[0].heading;
      blocks[0].heading = null;
      return str;
    } else {
      return null;
    }
  };

  useEffect(() => {
    //Highlight code blocks using prismjs
    highlightCode();

    setHeading(getHeading());
  }, []);

  return (
    <Container className="space-y-xl">
      {heading && (
        <Heading level={1} size={"lg"}>
          {heading}
        </Heading>
      )}

      {blocks && <BlockList blocks={blocks} />}
      <div className="flex max-w-md justify-center">
        <Link
          href="https://dataportal.se"
          rel="external noopener noreferrer"
          title="Fortroendemodellen logo badge"
          className="inline-block"
        >
          <Image
            src={fortroendemodellImage.src}
            width={200}
            height={200}
            alt="Förtroendemodellen logo badge"
          />
        </Link>
      </div>
    </Container>
  );
};
