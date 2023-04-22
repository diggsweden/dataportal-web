/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to be modified.
 * @returns {string} The modified string, with the first letter capitalized. If the string is falsy or not a string, returns an empty string.
 */
export const capitalizeFirstLetter = (string: string) => {
  if (!string || typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};
