import React from 'react';
import Image from 'next/image';
import { HeroBlock as IHeroBlock, HeroBlock_media } from '../../graphql/__generated__/HeroBlock';
import { imageLoader } from './MediaBlock';
import env from '@beam-australia/react-env';
import { checkLang } from '../../utilities/checkLang';
import { renderMarkdown } from '../Renderers';
import { Heading, Container } from '@digg/design-system';
import { MainContainerStyle } from '../../styles/general/emotion';

const renderMedia = (media: HeroBlock_media) => {
  const { url, alt, mime } = media;
  switch (media.__typename) {
    case 'dataportal_v1_Digg_Image':
      const width = media?.width || '';
      const height = media?.height || '';
      return (
        <Image
          loader={() => imageLoader((env('MEDIA_BASE_URL') || '') + url, width as number)}
          src={(env('MEDIA_BASE_URL') || '') + url}
          width={width}
          height={height}
          alt={alt || ''}
          layout="responsive"
          priority={true}
        />
      );
    case 'dataportal_v1_Digg_Video':
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

const theme = (uiHints: (DiggStrapiTheme | null)[]) => {
  // * Get a theme if there is one
  const darkTheme = uiHints?.find((hint) => hint === 'darkTheme');
  const grayTheme = uiHints?.find((hint) => hint === 'grayTheme');
  const greenTheme = uiHints?.find((hint) => hint === 'greenTheme');
  const lightGreenTheme = uiHints?.find((hint) => hint === 'lightGreenTheme');
  const orangeTheme = uiHints?.find((hint) => hint === 'orangeTheme');
  const lightOrangeTheme = uiHints?.find((hint) => hint === 'lightOrangeTheme');
  const pinkTheme = uiHints?.find((hint) => hint === 'pinkTheme');
  const ligthPinkTheme = uiHints?.find((hint) => hint === 'lightPinkTheme');

  if (darkTheme) return ` ${darkTheme}`;
  else if (grayTheme) return ` ${darkTheme}`;
  else if (greenTheme) return ` ${greenTheme}`;
  else if (lightGreenTheme) return ` ${lightGreenTheme}`;
  else if (orangeTheme) return ` ${orangeTheme}`;
  else if (lightOrangeTheme) return ` ${lightOrangeTheme}`;
  else if (pinkTheme) return ` ${pinkTheme}`;
  else if (ligthPinkTheme) return ` ${ligthPinkTheme}`;
  return '';
};

export const HeroBlock: React.FC<IHeroBlock> = ({ media, heading, heroText, uiHints }) => {
  return (
    <div className={`heroblock${theme(uiHints as (DiggStrapiTheme | null)[])}`}>
      {renderMedia(media)}
      {(heading || heroText) && (
        <Container cssProp={MainContainerStyle}>
          {heading && <Heading level={1}>{checkLang(heading)}</Heading>}
          <div className="content">
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
