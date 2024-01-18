import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import BodyVariant from "@/components/global/Typography/BodyVariant";
import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
  DOMNode,
} from "html-react-parser";
import Image from "next/image";

export const HtmlParser: FC<{ text: string }> = ({ text }) => {
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node instanceof Element) {
        const { name, attribs, children } = node;

        if (
          name === "ul" ||
          name === "ol" ||
          name === "li" ||
          name === "p" ||
          name === "a" ||
          name === "blockquote"
        ) {
          return (
            <BodyVariant variant={name} href={attribs.href}>
              {domToReact(children as DOMNode[], options)}
            </BodyVariant>
          );
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

        if (name === "table") {
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                {domToReact(children as DOMNode[], options)}
              </table>
            </div>
          );
        }

        if (attribs.class === "infoblock") {
          return (
            <div
              className={`!my-lg border border-l-[6px] border-primary p-lg  ${attribs.class}`}
            >
              {domToReact(children as DOMNode[], options)}
            </div>
          );
        }

        /* Remove smaller headings when strapi is fixed and only have h2 and h3 */
        if (
          name === "h1" ||
          name === "h2" ||
          name === "h3" ||
          name === "h4" ||
          name === "h5"
        ) {
          const level = parseInt(name[1]);
          const size = name === "h1" ? "lg" : name === "h2" ? "md" : "sm";
          const className =
            name === "h1"
              ? "!mt-lg md:!mt-xl"
              : name === "h2"
              ? "!mt-lg md:!mt-xl"
              : "!mt-md md:!mt-lg";
          return (
            // @ts-ignore
            <Heading level={level} size={size} className={className}>
              {domToReact(children as DOMNode[], options)}
            </Heading>
          );
        }
      }
    },
  };
  return <>{parse(text, options)}</>;
};
