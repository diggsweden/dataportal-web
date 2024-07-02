// Define the GraphQL operation you want to mock
const operationName = "GoodExample";

// The mock response you want to return
const mockResponse = {
  data: {
    heading: "Mickes goda exempel med mockdata",
  },
};

// In your Cypress test
describe("GraphQL API Mocking", () => {
  it("should mock a GraphQL query", () => {
    cy.intercept("https://graphql.digg.se/", (req) => {
      // Check if the request is the one we want to mock
      if (req.body.operationName === operationName) {
        // Provide the mock response
        req.reply({ body: mockResponse });
      }
    }).as("graphqlQuery");

    // Visit the page that makes the GraphQL request
    cy.visit("/goda-exempel/ai-verktyg-och-textdata-i-staten");

    // Wait for the mocked request to occur
    cy.wait("@graphqlQuery");

    // Now you can assert that your frontend behaves as expected with the mocked data
    // ...
  });
});

// // In your Cypress test
// describe("GraphQL API Mocking", () => {
//
//
//   it("should mock a GraphQL query", () => {
//
//
//     cy.intercept("POST", "https://graphql.digg.se/", (req) => {
//       if (req.body.operationName === "GoodExample") {
//         req.reply({ fixture: "cypress/fixtures/example.json" });
//       }
//     });
//
//     // Visit the page that makes the GraphQL request
//     cy.visit("/goda-exempel/ai-verktyg-och-textdata-i-staten");
//
//
//     // Now you can assert that your frontend behaves as expected with the mocked data
//     // ...
//   });
// });
