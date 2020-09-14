import i18n from 'i18n';

/**
 * Make @param str URL-friendly
 * @param str eg "detta är en rubrik - 1"
 */
export const slugify = (str:string) => {
 const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
 const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
 const p = new RegExp(a.split('').join('|'), 'g')

 if(!str)
   return '';

 return str.toString().toLowerCase()
   .replace(/\s+/g, '-') // Replace spaces with -
   .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
   .replace(/&/g, '-and-') // Replace & with 'and'
   .replace(/[^\w\-]+/g, '') // Remove all non-word characters
   .replace(/\-\-+/g, '-') // Replace multiple - with single -
   .replace(/^-+/, '') // Trim - from start of text
   .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Return relative path to search result page, with sent in @param resource and @param lang selected in search filters
 * @param resourceType 
 * @param resource 
 * @param lang
 */
export const searchDatasetsPagePath = (lang:string, resourceType:string, resource:string) => {
  if(lang && lang.length > 0 && resource && resource.length > 0)
  {
    return `/${lang}/${i18n.t('routes|datasets|path')}?f=${(encodeURIComponent(`${resourceType}||${resource}||FALSE||uri||${i18n.t('resource|'+resourceType)}||${i18n.t('resource|'+resource)}`))}`
  }

  return '';
}