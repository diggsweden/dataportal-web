beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Check concept page", () => {
  it("Verify start page has a search form", () => {
    // Go to concept search page.
    cy.visit("/sv/concepts");

    // Type a search query and click search.
    cy.get("input#search-field").type("data");
    cy.get(`button[aria-label="Sök"]`).click();

    // Check for the resultlist and click on the first item
    cy.get("ul.search-result-list", { timeout: 6000 })
      .find("li")
      .first()
      .click();

    // Check for headings and preamble
    cy.get("h1").should("exist");
    cy.get("p").should("exist");
    cy.get("h2").should("contain", "Underordnade begrepp");

    // Check for right columns data with heading
    cy.get("h2").should("contain", "Om begrepp");

    // Dowload rdf file and check dowload status (deletes files after test)
    cy.contains("a", "Ladda ner metadata som RDF/XML").click();
    cy.verifyDownload("rdf", { contains: true });
    cy.task("deleteFolder", "cypress//downloads//");
  });
});
