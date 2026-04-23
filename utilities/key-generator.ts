export const generateRandomKey = (length: number) => {
  // allowed characters
  const a =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  const b = [];
  for (let i = 0; i < length; i++) {
    // biome-ignore lint/suspicious/noExplicitAny: <unknown type>
    const j: any = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join("");
};

export default generateRandomKey;
