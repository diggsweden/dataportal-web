/**
 * Clears all items in local storage that have a key that begins with the specified prefix.
 *
 * @param prefix - The prefix to use for filtering the items to clear.
 * @param skip - An optional key to skip when clearing items.
 */
export function clearLocalStorage(prefix: string, skip?: string): void {
  const keysToClear: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix) && key !== skip) {
      keysToClear.push(key);
    }
  }

  keysToClear.forEach((key) => localStorage.removeItem(key));
}
