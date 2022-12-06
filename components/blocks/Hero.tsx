import React from 'react';
import Image from 'next/image';
import { Hero as IHero, Hero_media } from '../../graphql/__generated__/Hero';
import { checkLang } from '../../utilities/checkLang';
import { renderMarkdown } from '../Renderers';
import { Heading, Container } from '@digg/design-system';
import { handleUrl, handleLoader } from './Media';

const renderMedia = (media: Hero_media) => {
  const { alt, mime } = media;
  const url = handleUrl(media);

  switch (media.__typename) {
    case 'dataportal_Digg_Image':
      const width = media?.width || 1440;
      return (
        <div>
          <Image
            {...handleLoader(media)}
            style={{ width: '100%' }}
            src={url}
            fill
            alt={alt || ''}
            priority={true}
          />
        </div>
      );
    case 'dataportal_Digg_Video':
      return (
        <video controls>
          <source
            src={`${url}`}
            type={mime}
          />
        </video>
      );
  }
};

export const Hero: React.FC<IHero> = ({ media, heading, heroText }) => {
  return (
    <div className={`hero`}>
      <div className="hero--image">{renderMedia(media)}</div>
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
