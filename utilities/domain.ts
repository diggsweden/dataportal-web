import {
  BlockDataFragment as Block,
  RelatedContentFragment as RelatedContent,
} from "@/graphql/__generated__/operations";
import { DomainProps } from "@/components/content/DomainPage";
import { Dataportal_LinkType } from "@/graphql/__generated__/types";
import useTranslation from "next-translate/useTranslation";
import { Translate } from "next-translate";

interface ParsedProps {
  content: Block[];
  puffs: false | RelatedContent;
  heading?: string | null;
  preamble?: string | null;
  heroImage?: boolean;
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
    heroImage: true,
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation("pages");

  switch (domain) {
    case "offentligai":
      return {
        ...emptyProps,
      };
    case "data":
      return {
        ...emptyProps,
        preamble: t("data$preamble"),
        puffs: dataPuffs(t),
      };
    case "oppen-kallkod":
      return {
        ...emptyProps,
      };
    default:
      return {
        ...emptyProps,
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

  // Default values to return
  const def = () => {
    const puffs =
      blocks[0]?.__typename === "dataportal_Digg_RelatedContent" && blocks[0];
    const content = puffs ? blocks.slice(1) : blocks;

    return { content, puffs, heading, preamble };
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
                slug: "/offentligai/fortroendemodellen",
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
                slug: "/offentligai/fortroendemodellen",
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
      };
    case "data":
      const puffs = dataPuffs(t);
      const content = blocks;

      return { content, puffs, heading, preamble };
    case "oppen-kallkod":
      return def();
    default:
      news && newsArray.push(news);
      example && exampleArray.push(example);
      return def();
  }
};
