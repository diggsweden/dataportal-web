import React from 'react';
import { Heading, HeadingLevel, styled } from '@digg/design-system';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import Link from 'next/link';
import { isExternalLink, isMailLink } from '../../utilities';
import { ExternalLink } from '..';
import { checkLang } from '../../utilities/checkLang';

const generateHeadings = (options?: HeadingOption[]) => {
  const levels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];
  let headings: { [key: string]: (props: any) => any } = {};
  levels.map((level) => {
    const option = options?.find((opt) => opt.oldLevel === level);
    headings[`h${level}`] = (props) => (
      <Heading
        level={option?.newLevel ? option.newLevel : level}
        {...(option?.size ? { size: option.size } : {})}
      >
        {checkLang(props.children)}
      </Heading>
    );
  });
  return headings;
};

const renderImage = (props: any) => {
  return (
    <Image
      src={`${props.src}`}
      alt={props.alt}
      width={600}
      height={400}
    />
  );
};

const renderLink = ({ href, children }: any) => {
  return isExternalLink(href || '') ? (
    <ExternalLink
      isMail={isMailLink(href || '')}
      href={href || ''}
    >
      {children}
    </ExternalLink>
  ) : (
    <Link
      href={href || ''}
      passHref
    >
      <a className="markdown--link">
        <span>{children}</span>
      </a>
    </Link>
  );
};

const Markdown = styled.div`
  p,
  ul,
  ol,
  a,
  blockquote,
  code {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 1.125rem;
    @media screen and (min-width: 37.5em) {
      font-size: 18px;
      line-height: 27px;
    }
  }
  .markdown--link {
    margin-bottom: 1.125rem;
  }
  img {
    width: 100%;
  }
  ul {
    margin-top: 0;
  }
`;

type HeadingOption = {
  oldLevel: HeadingLevel;
  newLevel?: HeadingLevel;
  size?: keyof Typography;
};
export interface Options {
  headings?: HeadingOption[];
}

/**
 * Uses react-markdown to convert a markdown string to JSX
 * @param markdown
 * @returns markdown as JSX
 */
export const renderMarkdown = (markdown: string, options?: Options) => {
  const headings = generateHeadings(options?.headings);
  return (
    <Markdown>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          ...headings,
          a: (props) => renderLink(props),
          img: (props) => renderImage(props),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </Markdown>
  );
};

export default renderMarkdown;
