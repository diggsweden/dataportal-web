import React, { useContext, useEffect, useState } from "react";
import { SettingsContext } from "@/providers/settings-provider";
import { ContainerDataFragment } from "@/graphql/__generated__/operations";
import { checkLang, linkBase } from "@/utilities";
import { BlockList } from "@/components/blocks/block-list";
import { Heading } from "@/components/typography/heading";
import { Container } from "@/components/layout/container";
import { ContainerNav } from "@/components/navigation/container-nav";
import { StickyNav } from "@/components/navigation/sticky-nav";
import useTranslation from "next-translate/useTranslation";
import { usePathname } from "next/navigation";
import { Preamble } from "@/components/typography/preamble";
import { Translate } from "next-translate";

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
  const cont: HTMLElement =
    document.querySelector("#content") || document.createElement("div");

  const hTags = Array.prototype.slice.call(
    cont.querySelectorAll(".textBlock h2") || document.createElement("div"),
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

interface ContainerPageProps extends ContainerDataFragment {
  related?: ContainerDataFragment[];
}

export const highlightCode = (t: Translate) => {
  highlightCodeBlock().then(() => {
    // Adds line numbers to codeBlocks
    const pres = Array.prototype.slice.call(
      document.getElementsByTagName("pre"),
    );
    pres.forEach((pre) => {
      pre.classList.add("line-numbers");
      pre.setAttribute("role", "region");
      pre.setAttribute("aria-label", t("code-block"));
    });

    // Set timeout to allow for prismjs to load before adding new code
    setTimeout(() => {
      // Adds lang attribute to codeBlocks
      const codeWrappers = Array.prototype.slice.call(
        document.getElementsByClassName("code-toolbar"),
      );
      codeWrappers.map((codeWrapper) => codeWrapper.setAttribute("lang", "en"));

      // Add new code to set aria-labels
      const copyButtons = document.querySelectorAll(
        ".copy-to-clipboard-button",
      );
      copyButtons.forEach((button) => {
        // Create a live region for announcements
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.className = "sr-only";
        button.parentElement?.appendChild(liveRegion);

        // Set initial aria-label
        button.setAttribute("aria-label", t("copy-code"));

        // Add mutation observer to watch for data-copy-state changes
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === "data-copy-state") {
              const state = (mutation.target as HTMLElement).getAttribute(
                "data-copy-state",
              );
              let ariaLabel = t("copy-code");

              switch (state) {
                case "copy-success":
                  ariaLabel = t("code-copied-successfully");
                  break;
                case "copy-error":
                  ariaLabel = t("code-copy-failed");
                  break;
              }

              (mutation.target as HTMLElement).setAttribute(
                "aria-label",
                ariaLabel,
              );

              // Clear and update live region to trigger announcement
              liveRegion.textContent = "";
              setTimeout(() => {
                liveRegion.textContent = ariaLabel;
              }, 100);
            }
          });
        });

        observer.observe(button, { attributes: true });
      });
    }, 100);
  });
};

export const ContainerPage: React.FC<ContainerPageProps> = ({
  heading,
  image,
  preamble,
  blocks,
  related,
  parent,
}) => {
  const [menuItems, setMenuItems] = useState<Anchorlink[] | []>([]);
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const { t } = useTranslation("common");

  const hasRelatedContent = related && related.length > 1;

  useEffect(() => {
    //Highlights code using prismjs
    highlightCode(t);

    //Creates anchorlinks for the content menu
    const newMenuItems = getLinks();
    setMenuItems(newMenuItems);

    const crumbs = [{ name: "start", link: { ...linkBase, link: "/" } }];
    if (parent && parent.heading && parent.slug) {
      crumbs.push({
        name: parent.heading,
        link: { ...linkBase, link: parent.slug },
      });
    }

    setBreadcrumb &&
      setBreadcrumb({
        name: heading,
        crumbs: crumbs,
      });
  }, [pathname]);

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
          <div className="flex w-full flex-col items-start justify-end gap-xl lg:flex-row-reverse">
            {menuItems.length > 2 && (
              <div
                id="stickyNav"
                className="w-full overflow-y-auto lg:sticky lg:top-[4.75rem] lg:max-h-[calc(100vh-9.5rem)]"
              >
                <StickyNav
                  menuHeading={t("common|content-menu-heading")}
                  menuItems={menuItems}
                />
              </div>
            )}

            <div
              id="content"
              aria-label="Main content"
              className={`flex w-full max-w-md flex-col space-y-lg md:space-y-xl lg:min-w-[620px]`}
            >
              {!image && preamble && <Preamble>{checkLang(preamble)}</Preamble>}
              {blocks && blocks.length > 0 && <BlockList blocks={blocks} />}
            </div>
          </div>
        </div>
      </article>
    </Container>
  );
};
