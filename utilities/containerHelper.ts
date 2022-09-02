import { Containers_dataportal_Digg_Containers } from '../graphql/__generated__/Containers';

/**
 * Divides every slug from each container into string parts
 * @param {Array<Containers_dataportal_Digg_Containers>} containers
 * @returns {Array<String[]>} An array with stringarrays based on all containerslugs
 */
export const extractSlugs = (containers: (Containers_dataportal_Digg_Containers | null)[]) => {
  const slugsArray: Array<string[]> = [];
  containers.map((page) => {
    const slugs = page?.slug?.split('/') || [];
    slugs.length > 0 && slugs[0] === '' && slugs.shift();
    slugsArray.push(slugs);
  });

  return slugsArray;
};
