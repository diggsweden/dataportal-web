module.exports = {
  locales: ['sv', 'en'],
  defaultLocale: 'sv',
  pages: {
    '*': ['common', 'pages', 'resources', 'routes'],
  },
  nsSeparator: '|',
  keySeparator: '$',
  logger: () => {} // Delete this row to get logs from next-translate 
};
