import useTranslation from 'next-translate/useTranslation';
import { BreadcrumbProps } from '../components';
import { specialCharMap } from './specialCharMap';

/**
 * Converts a string to a URL-friendly slug.
 *
 * Replaces spaces with dashes, replaces special characters with their
 * replacements, replaces & with 'and', removes all non-word characters, replaces
 * multiple dashes with a single dash, and trims dashes from the start and end
 * of the string.
 *
 * @param {string} str - The string to convert to a slug
 * @returns {string} The resulting slug
 */

export const slugify = (str: string) => {
  if (!str) {
    return '';
  }

  let result = str.toLowerCase();

  // Replace spaces with -
  result = result.replace(/\s+/g, '-');

  // Replace special characters
  result = result.replace(/[^\w\s]/g, (char) => specialCharMap[char] || char);

  // Replace & with 'and'
  result = result.replace(/&/g, '-and-');

  // Remove all non-word characters
  result = result.replace(/[^\w\-]+/g, '');

  // Replace multiple - with single -
  result = result.replace(/\-\-+/g, '-');

  // Trim - from start and end of text
  result = result.replace(/^-+/, '').replace(/-+$/, '');

  return result;
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
    return `/${lang}/${t('routes|datasets$path')}?f=${encodeURIComponent(
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
