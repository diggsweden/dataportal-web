import { BlockList } from "@/components/blocks/block-list";
import { CodeHighlighter } from "@/components/code-highlighter";
import { Container } from "@/components/layout/container";
import { ContainerNav } from "@/components/navigation/container-nav";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import type {
  ContainerDataFragment,
  ParentSimplifiedFragment,
} from "@/graphql/gql/graphql";
import { checkLang } from "@/utilities";

import { ContainerStickyNav } from "./container-sticky-nav";

interface ContainerPageProps extends ContainerDataFragment {
  related?: ParentSimplifiedFragment[];
}

export function ContainerPage({
  heading,
  image,
  preamble,
  blocks,
  related,
}: ContainerPageProps) {
  const formPage = blocks?.find(
    (block) => block.__typename === "dataportal_Digg_FoertroendemodellenBlock",
  );
  const hasRelatedContent = related && related.length > 1;

  return (
    <Container>
      <article className="flex w-full flex-col gap-md lg:gap-xl xl:flex-row">
        {hasRelatedContent && <ContainerNav related={related} />}
        <div className="flex w-full flex-col">
          {!image && heading && (
            <Heading
              size={"lg"}
              level={1}
              className={`mb-lg md:mb-xl ${
                hasRelatedContent ? "xl:col-start-2 xl:mb-xl" : ""
              }`}
            >
              {checkLang(heading)}
            </Heading>
          )}
          <div className="flex w-full flex-col items-start justify-end gap-xl md:flex-row-reverse">
            <ContainerStickyNav />

            <section
              id="content"
              aria-label="Main content"
              className={`${
                formPage
                  ? "w-full"
                  : "flex w-full max-w-md flex-col space-y-lg md:space-y-xl lg:min-w-[620px]"
              }`}
            >
              {!image && preamble && <Preamble>{checkLang(preamble)}</Preamble>}
              {blocks && blocks.length > 0 && <BlockList blocks={blocks} />}
              <CodeHighlighter />
            </section>
          </div>
        </div>
      </article>
    </Container>
  );
}
