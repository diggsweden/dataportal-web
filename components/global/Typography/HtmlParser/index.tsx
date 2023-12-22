import { FC } from "react";
import Heading from "@/components/global/Typography/Heading";
import BodyVariant from "@/components/global/Typography/BodyVariant";
import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
  DOMNode,
} from "html-react-parser";
import Image from "next/image";
import QuoteBlock from "@/components/content/blocks/QuoteBlock";

export const HtmlParser: FC<{ text: string }> = ({ text }) => {
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node instanceof Element) {
        const { name, attribs, children } = node;

        if (name === "ul" || name === "ol" || name === "li" || name === "a") {
          return (
            <BodyVariant
              variant={name}
              href={attribs.href ? attribs.href : undefined}
            >
              {domToReact(children as DOMNode[], options)}
            </BodyVariant>
          );
        }

        if (name === "blockquote") {
          return <QuoteBlock>{domToReact(children as DOMNode[])}</QuoteBlock>;
        }

        if (name === "img") {
          return (
            <Image
              src={attribs.src}
              alt={attribs.alt}
              width={Number(attribs.width)}
              height={Number(attribs.height)}
            />
          );
        }
        if (name === "h1" || name === "h2" || name === "h3") {
          const level = parseInt(name[1]);
          const size = name === "h1" ? "lg" : name === "h2" ? "md" : "sm";

          return (
            // @ts-ignore
            <Heading level={level} size={size}>
              {domToReact(children as DOMNode[], options)}
            </Heading>
          );
        }
        /* Remove when strapi is fixed and only have  */
        if (name === "h4" || name === "h5" || name === "h6") {
          return (
            <Heading level={3} size={"sm"}>
              {domToReact(children as DOMNode[], options)}
            </Heading>
          );
        }
      }
    },
  };
  return <>{parse(text, options)}</>;
};
