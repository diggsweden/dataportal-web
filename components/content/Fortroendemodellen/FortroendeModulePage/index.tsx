import { FC, useEffect, useState } from "react";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { BlockList } from "@/components/content/blocks/BlockList";
import { highlightCode } from "@/components/content/ContainerPage";
import Container from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";

export const FortroendeModulePage: FC<ModuleDataFragment> = ({ blocks }) => {
  const [heading, setHeading] = useState<string | null>(null);

  const getHeading = () => {
    if (blocks[0]?.__typename === "dataportal_Digg_Text") {
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
    <Container>
      {heading && (
        <Heading level={1} size={"lg"}>
          {heading}
        </Heading>
      )}

      {blocks && <BlockList blocks={blocks} />}
    </Container>
  );
};
