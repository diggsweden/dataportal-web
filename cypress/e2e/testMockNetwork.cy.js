describe("Test the Mock server", () => {
  beforeEach(() => {
    // cy.readFile("./introspection.schema.graphql").then((schema) => {
    cy.readFile("./introspection.schema.graphql").then((schema) => {
      cy.mockNetwork({ schema });
    });

    // cy.visit("/goda-exempel/ai-verktyg-och-textdata-i-staten");
    // You may want to visit the same url for each test, in which case,
    // call cy.visit AFTER the network has been mocked.
    // cy.visit("/");
  });

  it("test Mock data", () => {
    cy.mockNetworkAdd({
      Query: {
        dataportal_Digg_Good_Examples: {
          id: "15",
          locale: "sv",
          updatedAt: "2024-04-02T21:53:56.148Z",
          createdAt: "2024-03-21T15:47:16.175Z",
          name: "TEST AI-verktyg och textdata i staten",
          heading: "TESTING AI-verktyg och textdata i staten",
          publisher:
            "TEST Ekonomistyrningsverkets datalabb i samverkan med Tillväxtverket.",
          preamble:
            "TEST Ekonomistyrningsverket och Tillväxtverket har tagit fram en prototyp för effektivare remisskrivande och ett förbättrat organisatoriskt minne.",
          slug: "/ai-verktyg-och-textdata-i-staten",
          publishedAt: "2024-03-21T12:00:00.000Z",
        },
      },
    });
    cy.visit("/goda-exempel/ai-verktyg-och-textdata-i-staten");
    cy.get("h1").should("contain", "Mickes goda exempel med mockdata");
  });
});
