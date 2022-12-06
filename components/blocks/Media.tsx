import Image from 'next/image';
import { Media as IMedia, Media_media } from '../../graphql/__generated__/Media';
import { FileLink } from '../Navigation';
import { checkLang } from '../../utilities/checkLang';
import env from '@beam-australia/react-env';
import { Heading } from '@digg/design-system';

export const imageLoader = (src: string, width: number, quality?: number) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const renderMedia = (media: Media_media, mediaDescription?: string) => {
  const { url, alt, description, mime } = media;
  switch (media.__typename) {
    case 'dataportal_Digg_Image':
      if (!url || url === '') {return null;}
      const width = media?.width || '';
      const height = media?.height || '';
      return (
        <figure>
          <Image
            loader={() => imageLoader((env('MEDIA_BASE_URL') || '') + url, width as number)}
            src={(env('MEDIA_BASE_URL') || '') + url}
            width={width || 0}
            height={height || 0}
            alt={alt || ''}
          />
          {mediaDescription && (
            <figcaption>
              <p className="media-description">{checkLang(mediaDescription)}</p>
            </figcaption>
          )}
        </figure>
      );
    case 'dataportal_Digg_Video':
      return (
        <figure role="group">
          <video controls>
            <source
              src={`${env('MEDIA_BASE_URL') || ''}${url}`}
              type={mime}
            />
          </video>
          {mediaDescription && (
            <figcaption>
              <p className="media-description">{checkLang(mediaDescription)}</p>
            </figcaption>
          )}
        </figure>
      );

    case 'dataportal_Digg_File':
      return <FileLink link={url}>{description || url}</FileLink>;
  }
};

export const Media: React.FC<IMedia> = ({ heading, description, media }) => {
  return (
    <div className="media">
      {heading && (
        <Heading
          level={2}
          className="media-heading"
        >
          {checkLang(heading)}
        </Heading>
      )}
      {renderMedia(media, description as string)}
    </div>
  );
};
