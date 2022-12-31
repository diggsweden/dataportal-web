/**
 * Determines if a given string is an external link.
 * An external link is defined as a string that begins with `http`, `https`, `www.`, or `mailto:`.
 *
 * @param href - The string to test.
 * @returns `true` if the string is an external link, `false` otherwise.
 */
export const isExternalLink = (href: string) => {
  return /^(http|https|www\.|mailto:)/.test(href);
};

/**
 * Determines if a given string is a mailto link.
 * A mailto link is defined as a string that begins with `mailto:`.
 *
 * @param href - The string to test.
 * @returns `true` if the string is a mailto link, `false` otherwise.
 */
export const isMailLink = (href: string) => {
  return /^mailto:/.test(href);
};

export const isDev = process.env.NODE_ENV === 'development';
export const hasWindow = typeof window !== 'undefined';
