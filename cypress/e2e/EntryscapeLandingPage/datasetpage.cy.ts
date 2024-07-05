beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Check dataset page", () => {
  it("Verify dataset page route and check data", () => {
    // Go to searchpage
    cy.visit("/sv/datasets");

    // verify H1 text
    cy.get("h1").contains("Sök data & API:er");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#search-field")
      .invoke("attr", "placeholder")
      .should("contain", "Sök Data & Api:er");

    // Type a search query and click search + find first result and click.
    cy.get("input#search-field").type("api");

    cy.get(`button[aria-label="Sök"]`)
      .click()
      .then(() => {
        cy.reload();
        cy.get("ul.search-result-list", { timeout: 6000 })
          .find("li")
          .first()
          .click();
      });

    // Check for heading, preamble, community box and svg icons
    cy.get("h1").should("exist");
    cy.get("pre").should("exist");
    cy.get(".contact__publisher").should("exist");
    cy.get("div.indicators").should("exist");

    // Check for right columns data with heading and keywords
    cy.get("h2").should("contain", "Om datamängd");
    cy.get("h2").should("contain", "Hämtad från katalog");
    cy.contains("div", "Nyckelord").should("exist");
    cy.get("span#eachpropexpand_0").should("exist");

    // Find the JSON bar and click on show more
    cy.get(".esbRowHead")
      .contains("span", "json")
      .parents(".esbRowHead")
      .within(() => {
        cy.get(".esbExpandButton").click();
      });

    // Confirm that it opened and find first label
    cy.get("#listExpand-1", { timeout: 10000 }).should("be.visible");
    cy.get("#listExpand-1").within(() => {
      cy.get(".rdformsLabel").should("exist");
    });

    // Find explore API button and check routing
    cy.get(".explore-api-btn").click();
  });
});
