import Image from 'next/image';
import { Media as IMedia, Media_media } from '../../graphql/__generated__/Media';
import { FileLink } from '../Navigation';
import { checkLang } from '../../utilities/checkLang';
import { Heading } from '@digg/design-system';
import { Video } from '../Video';
import env from '@beam-australia/react-env';
import { MediaBase } from '../../graphql/__generated__/MediaBase';
import { Image as ImageInterface } from '../../graphql/__generated__/Image';
import { responsive } from '../../styles/image';
import { isExternalLink } from '../../utilities/checkers';

export const handleLoader = ({ url, width, screen9 }: ImageInterface, quality?: number) => {
  if (screen9) return {};

  const src = (env('MEDIA_BASE_URL') || '') + url;
  return { loader: () => `${src}?w=${width}&q=${quality || 75}` };
};

export const handleUrl = ({ screen9, url }: MediaBase) => {
  if (screen9) {
    return url;
  }  

  if(isExternalLink(url))
    return url;

  return (env('MEDIA_BASE_URL') || '') + url;
};

const renderMedia = (media: Media_media, mediaDescription?: string) => {
  const { alt, description } = media;
  const url = handleUrl(media);
  switch (media.__typename) {
    case 'dataportal_Digg_Image':
      if (!url || url === '') {
        return null;
      }
      const width = media?.width || '';
      const height = media?.height || '';
      return (
        <figure>
          <Image
            {...handleLoader(media)}
            style={responsive}
            src={url}
            width={width || 600}
            height={height || 400}
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
          <Video {...media} />
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
