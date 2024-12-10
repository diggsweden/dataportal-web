export const clearLocalStorage = (prefix: string, skip?: string) => {
  const arr: Array<string | null> = []; // Array to hold the keys
  const pfLength = prefix.length;
  // Iterate over localStorage and insert the keys that meet the condition into arr
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.substring(0, pfLength) == prefix && key !== skip) {
      arr.push(key);
    }
  }

  // Iterate over arr and remove the items by key
  arr.forEach((key) => {
    key && localStorage.removeItem(key);
  });
};
