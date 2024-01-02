import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import Link from "next/link";
import QuoteIcon from "@/assets/icons/quote.svg";
import { checkLang, isExternalLink, isMailLink } from "@/utilities";
import { Heading } from "@/components/global/Typography/Heading";

type HeadingLevel = 1 | 2 | 3 | 4 | 5;

const generateHeadings = () => {
  const levels: HeadingLevel[] = [1, 2, 3, 4, 5];

  // eslint-disable-next-line no-unused-vars
  let headings: { [key: string]: (props: any) => any } = {};
  levels.map((level) => {
    const size = level === 1 ? "lg" : level === 2 ? "md" : "sm";
    const className =
      level === 1 ? "!mt-xl" : level === 2 ? "!mt-xl" : "!mt-lg";
    headings[`h${level}`] = (props) => (
      <Heading level={level} size={size} className={className}>
        {checkLang(props.children)}
      </Heading>
    );
  });
  return headings;
};

/**
 * Uses react-markdown to convert a markdown string to JSX
 * @param markdown
 * @returns markdown as JSX
 */
export const renderMarkdown = (markdown: string) => {
  const headings = generateHeadings();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        ...headings,
        a: (props) => renderLink(props),
        img: (props) => renderImage(props),
        blockquote: (props) => renderQuote(props.children),
        /*    pre: (props) => renderCode(props), */
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

const renderLink = ({ href, children }: any) => {
  return (
    <Link
      href={href}
      target={isExternalLink(href) || isMailLink(href) ? "_blank" : "_self"}
      className=""
    >
      <span>{children}</span>
    </Link>
  );
};

const renderImage = (props: any) => {
  return (
    <Image
      src={`${props.src}`}
      alt={props.alt}
      width={props.width}
      height={props.height}
    />
  );
};

const renderQuote = (children: any) => {
  return (
    <blockquote className="grid grid-cols-[40px_auto] gap-lg text-xl font-normal text-pink-600 [&_p]:col-start-2">
      <QuoteIcon className="col-start-1 flex w-[40px]" />
      {children}
    </blockquote>
  );
};

/*
const renderCode = (props: any) => {
  return (
    <div className="code-toolbar">
      <pre
        className={`line-numbers code-toolbar ${props.children[0].props.className}`}
      >
        {props.children}
      </pre>
      <div className="toolbar">
        <div className="toolbar-item">
          <button className="copy-to-clipboard-button">Copy</button>
        </div>
      </div>
    </div>
  );
};
 */
