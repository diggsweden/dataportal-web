/**
 * Generates a random string of the specified length.
 * The string will only contain the characters `a-z`, `A-Z`, and `0-9`.
 *
 * @param length - The length of the string to generate.
 * @returns The generated string.
 */
export function generateRandomKey(length: number): string {
  // allowed characters
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  // create an array of length `length`
  const key = new Array(length);

  // generate random values for each element in the array
  for (let i = 0; i < length; i++) {
    // get a character at a random index in the `characters` string
    key[i] = characters[Math.floor(Math.random() * characters.length)];
  }

  // return the array as a string
  return key.join('');
}
