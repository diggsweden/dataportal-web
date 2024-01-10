import { FC, useEffect, useState } from "react";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { BlockList } from "@/components/content/blocks/BlockList";
import { highlightCode } from "@/components/content/ContainerPage";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import { Button } from "@/components/global/Button";
import ArrowIcon from "@/assets/icons/arrowLeft.svg";

export const FortroendeModulePage: FC<ModuleDataFragment> = ({ blocks }) => {
  const { t } = useTranslation();
  const router = useRouter();
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
      <Button
        className="mb-lg"
        label={t("pages|form$go-back-text")}
        icon={ArrowIcon}
        iconPosition="left"
        onClick={() => router.back()}
      />

      {heading && (
        <Heading level={1} size={"lg"}>
          {heading}
        </Heading>
      )}

      {blocks && <BlockList blocks={blocks} />}
    </Container>
  );
};
