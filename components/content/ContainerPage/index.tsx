import React, { useContext, useEffect, useState } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import { ContainerData_Dataportal_Digg_Container_Fragment as IContainer } from "@/graphql/__generated__/operations";
import { RelatedContainerFragment } from "@/graphql/__generated__/operations";
import { isIE } from "@/utilities";
import { checkLang } from "@/utilities";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import BlockList from "@/components/content/blocks/BlockList";
import Heading from "@/components/global/Typography/Heading";
import Container from "@/components/layout/Container";
import ContainerSideBar from "@/components/navigation/ContainerSideBar";

/**
 * Uses prismjs to style codeblock
 */
export const highlightCodeBlock = async () => {
  // ? Fix to get <br/> as line-breaks
  (await import("prismjs")).hooks.add("before-highlight", function (env) {
    env.code = (env as any).element.innerText;
  });
  // * init prismjs
  (await import("prismjs")).highlightAll();
  // ? Await all plugins and components to fix hydration issue
  await require("prismjs/plugins/line-numbers/prism-line-numbers");
  await require("prismjs/components/prism-markup-templating");
  await require("prismjs/components/prism-csharp");
  await require("prismjs/components/prism-json");
  await require("prismjs/components/prism-javascript");
  await require("prismjs/components/prism-css");
  await require("prismjs/components/prism-php");
  await require("prismjs/components/prism-ruby");
  await require("prismjs/components/prism-python");
  await require("prismjs/components/prism-java");
  await require("prismjs/components/prism-c");
  await require("prismjs/components/prism-cpp");
  await require("prismjs/plugins/line-numbers/prism-line-numbers");
  await require("prismjs/plugins/toolbar/prism-toolbar");
  await require("prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard");
};

/**
 * Gets all h2 elements on the page and sets id:s to a visibility:hidden sibling be used
 * in the anchorLinkMenu
 * @returns {Array} An array of id:s to all h2-elements on the page
 */
const getLinks = () => {
  const menuItems: Anchorlink[] = [];
  const headerScope = ".content";
  const cont: HTMLElement =
    document.querySelector(headerScope) || document.createElement("div");
  const hTags = Array.prototype.slice.call(
    cont.querySelectorAll("h2") || document.createElement("div"),
    0,
  );

  // Set only if there are more than 2 elements
  hTags.length > 2 &&
    hTags.forEach((element: HTMLElement) => {
      // filter swedish charachters and whitespaces from anchor
      let chars: any = { å: "a", ä: "a", ö: "o", " ": "_", ".": "" };
      const id = `${element.innerText
        .toLowerCase()
        .replace(/[åäö\s\.]/g, (m: any) => chars[m])}`;
      // Get the sibling element and give it the id
      element.id = `${id}`;
      menuItems.push({
        id: id,
        text: element.textContent,
      } as Anchorlink);
    });

  return menuItems;
};

interface ContainerPageProps extends IContainer {
  related?: RelatedContainerFragment[];
  domain?: DiggDomain;
  category?: IContainer;
}

export const highlightCode = () => {
  highlightCodeBlock();

  // Adds lang attribute to codeBlocks
  const codeWrappers = Array.prototype.slice.call(
    document.getElementsByClassName("code-toolbar"),
  );
  codeWrappers.map((codeWrapper) => codeWrapper.setAttribute("lang", "en"));

  // Adds line numbers to codeBlocks
  const pres = Array.prototype.slice.call(document.getElementsByTagName("pre"));
  pres.map((pre) => pre.classList.add("line-numbers"));
};

export const ContainerPage: React.FC<ContainerPageProps> = ({
  heading,
  preamble,
  blocks,
  name,
  related,
  domain,
}) => {
  const [menuItems, setMenuItems] = useState<Anchorlink[]>([]);
  const { asPath } = useRouter() || {};
  const { trackPageView } = useMatomo();

  const { appRenderKey } = useContext(SettingsContext);

  // todo - add some conditions for these
  /*   const showContentMenu = menuItems[0] && menuItems.length > 2; */

  const hasRelatedContent = related && related.length > 2;

  useEffect(() => {
    const newMenuItems = getLinks();
    // Make sure that the state needs to be updated
    if (
      (menuItems[0] &&
        newMenuItems[0] &&
        menuItems[0].id !== newMenuItems[0].id) ||
      (menuItems[0] && !newMenuItems[0]) ||
      (!menuItems[0] && newMenuItems[0])
    ) {
      !isIE && setMenuItems(newMenuItems);
    }
  }, [menuItems, asPath, appRenderKey]);

  useEffect(() => {
    //Highlights code using prismjs
    highlightCode();

    // Matomo tracking
    trackPageView({ documentTitle: name });
  }, [asPath]);

  return (
    <Container>
      <div
        className={`grid space-y-xl py-xl md:grid-cols-[620px_minmax(0,_1fr)] 
        lg:grid-cols-[200px_620px_minmax(0,_1fr)] lg:gap-x-xl`}
      >
        {hasRelatedContent && (
          <ContainerSideBar related={related} domain={domain} />
        )}
        {heading && (
          <Heading
            size={"lg"}
            level={1}
            className="col-span-2 row-span-1 !mt-none lg:col-start-2"
          >
            {checkLang(heading)}
          </Heading>
        )}

        <div className="max-w-md space-y-xl lg:col-span-3 lg:col-start-2">
          <p className="text-lg text-brown-600">{checkLang(preamble)}</p>
          {blocks && blocks.length > 0 && <BlockList blocks={blocks} />}
        </div>

        <div className="anchorlink_wrapper">
          {/*       {showContentMenu && (
            <div>
              <AnchorLinkMenu
                menuItems={menuItems}
                menuHeading={t("common|content-menu-heading")}
                anchorLinkMenuRef={AnchorLinkMenuRef}
              />
            </div>
          )} */}
        </div>
      </div>
    </Container>
  );
};
