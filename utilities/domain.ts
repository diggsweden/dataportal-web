import {
  BlockDataFragment as Block,
  ImageFragment,
  RelatedContentFragment as RelatedContent,
} from "@/graphql/__generated__/operations";
import { DomainProps } from "@/components/content/DomainPage";
import { Dataportal_LinkType } from "@/graphql/__generated__/types";
import useTranslation from "next-translate/useTranslation";
import start from "@/public/images/illu-start.png";
import ai from "@/public/images/illu-ai.png";
import data from "@/public/images/illu-data.png";
import kallkod from "@/public/images/illu-kallkod.png";
import { Translate } from "next-translate";
import { handleUrl } from "@/components/content/blocks/MediaBlock";
import { renderImage } from "@/utilities/app";

interface ParsedProps {
  content: Block[];
  puffs: false | RelatedContent;
  heading: string | null;
  preamble: string | null;
  image?: ImageFragment;
}

const populate: any = {
  __typename: "dataportal_Digg_Link",
  linktype: Dataportal_LinkType.Internal,
};

const dataPuffs = (t: Translate): RelatedContent => ({
  id: "data-search-puffs",
  __typename: "dataportal_Digg_RelatedContent",
  links: [
    {
      ...populate,
      title: t("search$datasets"),
      slug: "/datasets?q=&f=",
      description: t("startpage$explore_datasets"),
    },
    {
      ...populate,
      title: t("search$concepts"),
      slug: "/concepts?q=&f=",
      description: t("startpage$explore_concepts"),
    },
    {
      ...populate,
      title: t("search$specifications"),
      slug: "/specifications?q=&f=",
      description: t("startpage$explore_specs"),
    },
  ],
});

/**
 * @param {DiggDomain} domain
 * @returns {ParsedProps} Hardcoded props based on domain
 */
const fallback = (domain: DiggDomain | undefined): ParsedProps => {
  const emptyProps = {
    content: [],
    puffs: false as false | RelatedContent,
    publications: [],
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation("pages");

  switch (domain) {
    case "offentligai":
      return {
        ...emptyProps,
        heading: t("ai$heading"),
        preamble: t("ai$preamble"),
        image: renderImage(ai),
      };
    case "data":
      return {
        ...emptyProps,
        heading: t("data$heading"),
        preamble: t("data$preamble"),
        image: renderImage(data),
        puffs: dataPuffs(t),
      };
    case "oppen-kallkod":
      return {
        ...emptyProps,
        heading: t("os$heading"),
        preamble: t("os$preamble"),
        image: renderImage(kallkod),
      };
    default:
      return {
        ...emptyProps,
        heading: t("startpage$heading"),
        preamble: t("startpage$preamble"),
        image: renderImage(start as any),
      };
  }
};

/**
 * Handles differences between domains
 * @param props
 * @returns {ParsedProps} Tailored to each specific domain
 */
export const handleDomain = (props: DomainProps): ParsedProps => {
  // Check if we don't have response from server, return fallback
  if (!props.id) return fallback(props.domain);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation("pages");
  const { domain, news, example, blocks, heading, preamble } = props;
  const newsArray = [];
  const exampleArray = [];

  const image: ImageFragment | undefined = props.image
    ? {
        ...(props.image as ImageFragment),
        url: `${handleUrl(props.image)}`,
      }
    : undefined;

  // Default values to return
  const def = () => {
    const puffs =
      blocks[0]?.__typename === "dataportal_Digg_RelatedContent" && blocks[0];
    const content = puffs ? blocks.slice(1) : blocks;

    return { content, puffs, heading, preamble, image };
  };

  switch (domain) {
    case "offentligai":
      const aiStrapiPuffs =
        blocks[0]?.__typename === "dataportal_Digg_RelatedContent" && blocks[0];
      const aiPuffs: RelatedContent = aiStrapiPuffs
        ? {
            ...aiStrapiPuffs,
            links: [
              ...aiStrapiPuffs.links,
              {
                ...populate,
                title: t("ai$model"),
                slug: "/fortroendemodellen",
                description: t("ai$model_description"),
              },
            ],
          }
        : {
            id: "ai-puffs",
            __typename: "dataportal_Digg_RelatedContent",
            links: [
              {
                ...populate,
                title: t("ai$model"),
                slug: "/fortroendemodellen",
                description: t("ai$model_description"),
              },
            ],
          };
      const aiContent = aiStrapiPuffs ? blocks.slice(1) : blocks;

      return {
        content: aiContent,
        puffs: aiPuffs,
        heading,
        preamble,
        image,
      };
    case "data":
      const puffs = dataPuffs(t);
      const content = blocks;

      return { content, puffs, heading, preamble, image };
    case "oppen-kallkod":
      return def();
    default:
      news && newsArray.push(news);
      example && exampleArray.push(example);
      return def();
  }
};
