module.exports = {
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localeDetection: false,
  pages: {
    "*": ["common", "pages", "resources", "routes", "filters"],
  },
  nsSeparator: "|",
  keySeparator: "$",
  logger: () => {}, // Delete this row to get logs from next-translate
};
