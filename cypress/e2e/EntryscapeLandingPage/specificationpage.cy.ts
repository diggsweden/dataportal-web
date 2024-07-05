beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Check specification page", () => {
  it("Verify specification page route and check data", () => {
    // Go to specification search page.
    cy.visit("/sv/specifications");

    // Type a search query and click search.
    cy.get("input#search-field").type("api");
    cy.get(`button[aria-label="Sök"]`).click();

    // Check for the resultlist and click on the first item
    cy.get("ul.search-result-list", { timeout: 6000 })
      .find("li")
      .first()
      .click();

    // Check for headings preamble and community box
    cy.get("h1").should("exist");
    cy.get("span.entryscape")
      .invoke("attr", "data-entryscape-content")
      .should("exist");
    cy.get(".contact__publisher").should("exist");

    // Check for right columns data with heading and keywords
    cy.get("h2").should("contain", "Om specifikation");
    cy.contains("div", "Nyckelord").should("exist");
    cy.get("span#eachpropexpand_0").should("exist");

    // Find the JSON bar and click on show more
    cy.get(".esbExpandButton").eq(0).click();

    // Confirm that it opened and find first label
    cy.get("#listExpand-0", { timeout: 10000 }).should("be.visible");
    cy.get("#listExpand-0").within(() => {
      cy.get(".rdformsLabel").should("exist");
    });

    // Find explore API button and check routing
    cy.contains("button", "Åtkomst").first().click();
  });
});
