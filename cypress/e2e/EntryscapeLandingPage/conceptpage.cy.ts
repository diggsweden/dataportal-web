beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Search concepts", () => {
  /**
   * Verify that the search page is accessible and that the search for concepts gives results.
   */
  it("Verify concepts search result", () => {
    // Go to searchpage
    cy.visit("/sv/concepts");

    // verify H1 text
    cy.get("h1").contains("Sök begrepp");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#search-field")
      .invoke("attr", "placeholder")
      .should("contain", "Sök begrepp");

    // Type a search query and click search + find first result and click.
    cy.get("input#search-field").type("data");

    cy.get(`button[aria-label="Sök"]`)
      .click()
      .then(() => {
        cy.reload();
        cy.get("ul.search-result-list", { timeout: 10000 })
          .find("li")
          .first()
          .click();
      });

    // Check for headings and preamble on concept page
    cy.get("h1").should("exist");
    cy.get("p").should("exist");
    cy.get("h2").should("contain", "Underordnade begrepp");

    // Check for right columns data with heading and keywords
    cy.get("h2").should("contain", "Om begrepp");

    // Dowload rdf file and check dowload status (deletes files after test)
    cy.contains("a", "Ladda ner metadata som RDF/XML").click();
    cy.verifyDownload("rdf", { contains: true });
    cy.task("deleteFolder", "cypress//downloads//");
  });
});
