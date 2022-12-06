import React from 'react';
import Image from 'next/image';
import { Hero as IHero, Hero_media } from '../../graphql/__generated__/Hero';
import { imageLoader } from './Media';
import env from '@beam-australia/react-env';
import { checkLang } from '../../utilities/checkLang';
import { renderMarkdown } from '../Renderers';
import { Heading, Container } from '@digg/design-system';

const renderMedia = (media: Hero_media) => {
  const { url, alt, mime } = media;
  switch (media.__typename) {
    case 'dataportal_Digg_Image':
      const width = media?.width || '';
      const height = media?.height || '';
      return (
        <div>
          <Image
            loader={() => imageLoader((env('MEDIA_BASE_URL') || '') + url, width as number)}
            src={(env('MEDIA_BASE_URL') || '') + url}
            width={width}
            height={height}
            alt={alt || ''}
            layout="responsive"
            priority={true}
          />
        </div>
      );
    case 'dataportal_Digg_Video':
      return (
        <video controls>
          <source
            src={`${env('MEDIA_BASE_URL') || ''}${url}`}
            type={mime}
          />
        </video>
      );
  }
};

export const Hero: React.FC<IHero> = ({ media, heading, heroText }) => {
  return (
    <div className={`hero`}>
      {renderMedia(media)}
      {(heading || heroText) && (
        <Container>
          {heading && (
            <Heading
              level={1}
              size="3xl"
              weight="light"
              color="pinkPop"
            >
              {checkLang(heading)}
            </Heading>
          )}
          <div className="hero--content">
            {heroText && (
              <div className="text-lg preamble">
                {heroText.markdown && renderMarkdown(heroText.markdown)}
              </div>
            )}
          </div>
        </Container>
      )}
    </div>
  );
};
