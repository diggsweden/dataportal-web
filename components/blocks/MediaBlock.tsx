import React from 'react';
import Image from 'next/image';
import {
  MediaBlock as IMediaBlock,
  MediaBlock_media,
} from '../../graphql/__generated__/MediaBlock';
import { FileLink } from '../Links';
import { checkLang } from '../../utilities/checkLang';
import env from '@beam-australia/react-env';
import { Heading } from '@digg/design-system';

export const imageLoader = (src: string, width: number, quality?: number) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const renderMedia = (media: MediaBlock_media, mediaDescription?: string) => {
  const { url, alt, description, mime } = media;
  switch (media.__typename) {
    case 'dataportal_Digg_Image':
      const width = media?.width || '';
      const height = media?.height || '';
      return (
        <figure>
          <Image
            loader={() => imageLoader((env('MEDIA_BASE_URL') || '') + url, width as number)}
            src={(env('MEDIA_BASE_URL') || '') + url}
            width={width}
            height={height}
            alt={alt || ''}
            layout="responsive"
          />
          {mediaDescription && (
            <figcaption>
              <p className="mediaBlock-description">{checkLang(mediaDescription)}</p>
            </figcaption>
          )}
        </figure>
      );
    case 'dataportal_Digg_Video':
      return (
        <figure role={'group'}>
          <video controls>
            <source
              src={`${env('MEDIA_BASE_URL') || ''}${url}`}
              type={mime}
            />
          </video>
          {mediaDescription && (
            <figcaption>
              <p className="mediaBlock-description">{checkLang(mediaDescription)}</p>
            </figcaption>
          )}
        </figure>
      );

    case 'dataportal_Digg_File':
      return <FileLink link={url}>{description || url}</FileLink>;
  }
};

export const MediaBlock: React.FC<IMediaBlock> = ({ heading, description, media }) => {
  return (
    <div className="mediaBlock">
      {heading && (
        <Heading
          level={2}
          className="mediaBlock-heading"
        >
          {checkLang(heading)}
        </Heading>
      )}
      {renderMedia(media, description as string)}
    </div>
  );
};
