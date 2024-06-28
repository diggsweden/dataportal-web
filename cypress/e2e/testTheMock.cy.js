describe("Test the Mock server", () => {

beforeEach(() => {
    // cy.readFile("./graphql/schema.json").then((schema) => {
    cy.readFile("./introspection.schema.graphql").then((schema) => {
      cy.mockNetwork({ schema });
    });

    // You may want to visit the same url for each test, in which case,
    // call cy.visit AFTER the network has been mocked.
    // cy.visit('http://localhost:3000');
  });

  it("test Mock data", () => {

    cy.mockNetworkAdd({
      Query: () => ({
        Dataportal_Digg_Containers: () => ({
          dataportal_Digg_Containers: () => ({
            heading: "Mickes Test mockdata",
          }),
        }),
      }),
    });

    // Gg to start page.
    cy.visit("/rest-api-profil/om-rest-api-profilen");
    cy.get("h1").should("contain", "Mickes Test mockdata");
  });
});
