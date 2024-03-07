import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import BodyVariant from "@/components/global/Typography/BodyVariant";
import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
  DOMNode,
} from "html-react-parser";
import { CustomImage } from "@/components/global/CustomImage";
import { ImageFragment } from "@/graphql/__generated__/operations";

export const HtmlParser: FC<{ text: string }> = ({ text }) => {
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node instanceof Element) {
        const { name, attribs, children, prev } = node;

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
          const image = {
            __typename: "dataportal_Digg_Image",
            width: Number(attribs.width),
            height: Number(attribs.height),
            url: attribs.src,
            alt: attribs.alt,
            name: null,
            description: null,
            mime: "image/png",
            ext: ".png",
            screen9: null,
          };
          return (
            <CustomImage
              image={image as ImageFragment}
              sizes="(max-width: 640px) 80vw, (max-width: 1200px) 60vw, (max-width: 1920px) 30vw, 25vw"
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
              className={`!my-lg border border-l-[6px] border-green-600 bg-white p-lg ${attribs.class}`}
            >
              {domToReact(children as DOMNode[], options)}
            </div>
          );
        }

        if (attribs.class === "border") {
          return (
            <div
              className={`!my-lg border border-l-[6px] border-primary p-lg ${attribs.class}`}
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
              : name === "h2" && prev
              ? "!mt-lg md:!mt-xl !mb-md md:!mb-lg"
              : name === "h2"
              ? "!mb-md md:!mb-lg"
              : name === "h3" && !prev
              ? "!mb-md"
              : "!mt-md md:!mt-lg !mb-md";
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
