import useTranslation from 'next-translate/useTranslation';
import { BreadcrumbProps, IPuff } from '../components';

/**
 * Make @param str URL-friendly
 * @param str eg "detta är en rubrik - 1"
 */
export const slugify = (str: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  if (!str) return '';

  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Return relative path to search result page, with sent in @param resource and @param lang selected in search filters
 * @param resourceType
 * @param resource
 * @param lang
 */
export const SearchDatasetsPagePath = (lang: string, resourceType: string, resource: string) => {
  const { t } = useTranslation();
  if (lang && lang.length > 0 && resource && resource.length > 0) {
    return `/${t('routes|datasets$path')}?f=${encodeURIComponent(
      `${resourceType}||${resource}||FALSE||uri||${t('resources|' + resourceType)}||${t(
        'resources|' + resource
      )}`
    )}`;
  }

  return '';
};

// Used to satisfy typescript condition for DiggLink
export const linkBase: DiggLink = {
  __typename: 'dataportal_Digg_Link',
  linktype: 'INTERNAL',
  link: '',
  title: '',
  description: '',
};

/**
 * Takes the url path and parses it to breadcrumbs
 *
 * @param {string} path url path to the current resource
 * @param {string} inactiveCrumbName the title of the current resource ex the h1
 * @returns {BreadcrumbProps} BreadcrumbProps to use for settings breadcrumb
 */
export const makeBreadcrumbsFromPath = (
  path: string,
  inactiveCrumbName: string
): BreadcrumbProps => {
  const paths = path.split('/');
  paths.shift();
  const crumbs: Breadcrumb[] = [{ name: 'Start', link: { ...linkBase, link: '/' } }];
  paths.map((p, index) => {
    if (index !== paths.length - 1) {
      const capitalized = p.charAt(0).toUpperCase() + p.slice(1);
      crumbs.push({
        name: capitalized.replace('-', ' '),
        link: { ...linkBase, link: `${crumbs[index].link}${index !== 0 ? '/' : ''}${p}` },
      });
    }
  });
  return { name: inactiveCrumbName, crumbs };
};

const areasColors: ColorGroupOverride = {
  accent: 'black',
  background: 'pinkPop',
};

// todo - use translations for title and slugs
export const areas: IPuff[] = [
  { title: 'Livslångt lärande', slug: '/livslangt-larande', colors: areasColors },
  { title: 'Bilddata', slug: '/bilddata', colors: areasColors },
  { title: 'Elektriska vägar', slug: '/elektriska-vagar', colors: areasColors },
  { title: 'Rymddata', slug: '/rymddata', colors: areasColors },
  { title: 'Smart statistik', slug: '/smart-statistik', colors: areasColors },
];

const themesColors: ColorGroupOverride = {
  accent: 'pinkPop',
  background: 'gray800',
};

// todo - use translations for title and slugs
export const themes: IPuff[] = [
  { title: 'Upphandling', slug: '/upphandling', icon: 'bookThin', colors: themesColors },
  { title: 'Innovation', slug: '/innovation', icon: 'alien8bit', colors: themesColors },
  { title: 'Tema 3', slug: '/tema-3', icon: 'binaryThin', colors: themesColors },
  { title: 'Tema 4', slug: '/tema-4', icon: 'menu', colors: themesColors },
  { title: 'Tema 5', slug: '/tema-5', icon: 'arrowDrop', colors: themesColors },
];
