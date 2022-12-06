import {
  Containers_dataportal_Digg_Containers_blocks as Block,
  Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent as RelatedContent,
} from '../graphql/__generated__/Containers';
import { Publication_dataportal_Digg_Publications as IPublication } from '../graphql/__generated__/Publication';
import { DomainProps } from '../components/pages/DomainPage';
import { dataportal_LinkType } from '../graphql/__generated__/globalTypes';
import useTranslation from 'next-translate/useTranslation';
import { Image } from '../graphql/__generated__/Image';
import env from '@beam-australia/react-env';
import start from '../public/images/illu-start.png';
import ai from '../public/images/illu-ai.png';
import data from '../public/images/illu-data.png';
import kallkod from '../public/images/illu-kallkod.png';
import { StaticImageData } from 'next/image';
import { Translate } from 'next-translate';
import { handleUrl } from '../components';

interface ParsedProps {
  content: Block[];
  puffs: false | RelatedContent;
  publications: IPublication[];
  heading: string | null;
  preamble: string | null;
  image?: Image;
}

const populate: any = {
  __typename: 'dataportal_Digg_Link',
  linktype: dataportal_LinkType.INTERNAL,
};

const dataPuffs = (t: Translate): RelatedContent => ({
  id: 'data-search-puffs',
  __typename: 'dataportal_Digg_RelatedContent',
  links: [
    {
      ...populate,
      title: t('search$datasets'),
      slug: '/datasets?q=&f=',
      description: t('startpage$explore_datasets')
    },
    {
      ...populate,
      title: t('search$concepts'),
      slug: '/concepts?q=&f=',
      description: t('startpage$explore_concepts')
    },
    {
      ...populate,
      title: t('search$specifications'),
      slug: '/specifications?q=&f=',
      description: t('startpage$explore_specs')
    },
  ],
});

/**
 * @param {DiggDomain} domain
 * @returns {ParsedProps} Hardcoded props based on domain
 */
const fallback = (domain: DiggDomain | undefined): ParsedProps => {
  const emptyProps = { content: [], puffs: false as false | RelatedContent, publications: [] };
  const { t } = useTranslation('pages');

  const image = (img: StaticImageData): Image => ({
    __typename: 'dataportal_Digg_Image',
    url: img as any,
    name: null,
    alt: null,
    description: null,
    mime: 'image/png',
    ext: '.png',
    width: img.width,
    height: img.height,
    screen9: { id: '' }, // just add dummy data to make ts happy
  });

  switch (domain) {
    case 'ai':
      return {
        ...emptyProps,
        heading: t('ai$heading'),
        preamble: t('ai$preamble'),
        image: image(ai),
      };
    case 'data':
      return {
        ...emptyProps,
        heading: t('data$heading'),
        preamble: t('data$preamble'),
        image: image(data),
        puffs: dataPuffs(t),
      };
    case 'oppen-kallkod':
      return {
        ...emptyProps,
        heading: t('os$heading'),
        preamble: t('os$preamble'),
        image: image(kallkod),
      };
    default:
      return {
        ...emptyProps,
        heading: t('startpage$heading'),
        preamble: t('startpage$preamble'),
        image: image(start as any),
      };
  }
};

/**
 * Handles differences between domains
 * @param props
 * @returns {ParsedProps} Tailored to each specific domain
 */
export const handleDomain = (props: DomainProps): ParsedProps => {
  // Check if we don't have response from server, return fallback
  if (!props.id) return fallback(props.domain);

  const { t } = useTranslation('pages');
  const { domain, news, example, event, blocks, heading, preamble } = props;
  const publications: Array<IPublication> = [];

  const image: Image | undefined = props.image
    ? {
        ...(props.image as Image),
        url: `${handleUrl(props.image)}`,
      }
    : undefined;

  // Default values to return
  const def = () => {
    const puffs = blocks[0]?.__typename === 'dataportal_Digg_RelatedContent' && blocks[0];
    const content = puffs ? blocks.slice(1) : blocks;

    return { content, puffs, publications, heading, preamble, image };
  };

  switch (domain) {
    case 'ai':
      const aiStrapiPuffs = blocks[0]?.__typename === 'dataportal_Digg_RelatedContent' && blocks[0];
      const aiPuffs: RelatedContent = aiStrapiPuffs
        ? {
            ...aiStrapiPuffs,
            links: [
              ...aiStrapiPuffs.links,
              // {
              //   ...populate,
              //   title: t('ai$model'),
              //   slug: '/fortroendemodellen',
              //   description: t('ai$model_description'),
              // },
            ],
          }
        : {
            id: 'ai-puffs',
            __typename: 'dataportal_Digg_RelatedContent',
            links: [
              // {
              //   ...populate,
              //   title: t('ai$model'),
              //   slug: '/fortroendemodellen',
              //   description: t('ai$model_description'),
              // },
            ],
          };
      const aiContent = aiStrapiPuffs ? blocks.slice(1) : blocks;

      return { content: aiContent, puffs: aiPuffs, publications, heading, preamble, image };
    case 'data':
      const puffs = dataPuffs(t);
      const content = blocks;

      return { content, puffs, publications, heading, preamble, image };
    case 'oppen-kallkod':
      return def();
    default:
      news && publications.push(news);
      example && publications.push(example);
      event && publications.push(event);
      return def();
  }
};
