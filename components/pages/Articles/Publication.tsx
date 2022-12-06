import env from '@beam-australia/react-env';
import { Heading, css, Container } from '@digg/design-system';
import Image from 'next/image';
import React from 'react';
import { imageLoader, ContentArea, ArticleBlock } from '../..';
import { Containers_dataportal_Digg_Containers_blocks } from '../../../graphql/__generated__/Containers';
import { Module_blocks } from '../../../graphql/__generated__/Module';
import { Publication_dataportal_Digg_Publications_tags } from '../../../graphql/__generated__/Publication';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { PublicationResponse, checkLang } from '../../../utilities';

const whitelistedTagsSV = ['Goda exempel', 'Event', 'Nyhet'];
export const findPublicationTypeTag = (tags: Publication_dataportal_Digg_Publications_tags[]) => {
  const tag = tags.find((tag) => whitelistedTagsSV.includes(tag.value));
  return tag;
};

const getRelatedHeading = (tag: string) => {
  switch (tag) {
    case 'Event':
      return tag.toLowerCase();
    case 'Goda exempel':
      return tag.toLowerCase();
    case 'Nyhet':
      return 'nyheter';
    default:
      return 'artiklar';
  }
};

export const Publication: React.FC<PublicationResponse> = ({
  heading,
  preamble,
  image,
  tags,
  blocks,
  related,
}) => {
  const { url, alt, width } = image || {};
  return (
    <Container cssProp={MainContainerStyle}>
      {image && (
        <Image
          loader={() => imageLoader((env('MEDIA_BASE_URL') || '') + url, width as number)}
          src={(env('MEDIA_BASE_URL') || '') + url}
          width={width || 1440}
          height={400}
          alt={alt || ''}
          layout="responsive"
        />
      )}
      <div
        css={css`
          position: relative;
          `}
      >        
        <div className={'content'}>   
          {heading && 
          <Heading size={"3xl"} weight={'light'} color={'pinkPop'}>
            {checkLang(heading)}
          </Heading>}       
          <p className="preamble text-lg">{checkLang(preamble)}</p>
          {blocks && blocks.length > 0 && (
            <ContentArea
              blocks={
                blocks as (Containers_dataportal_Digg_Containers_blocks | Module_blocks | null)[]
              }
            />
          )}
        </div>
      </div>
      {related && related.length > 0 && (
        <div className='related-content'>
          <Heading level={2}>
            Fler {tags && getRelatedHeading(findPublicationTypeTag(tags as any[])?.value || '')}
          </Heading>
          <ArticleBlock articles={related} />
        </div>
      )}
    </Container>
  );
};
