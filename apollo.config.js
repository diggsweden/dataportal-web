module.exports = {
  client: {
    name: 'Dataportal WebClient',
    includes: ['graphql/**/*'],
    service: {
      name: 'strapi-base',
      url: 'http://localhost:1300/',
    },
  },
};
