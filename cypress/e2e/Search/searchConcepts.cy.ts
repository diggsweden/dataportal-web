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
    // Gg to searchpage
    cy.visit("/sv/concepts");

    // verify H1 text
    cy.get("h1").contains("Sök begrepp");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#search-field")
      .invoke("attr", "placeholder")
      .should("contain", "Sök begrepp");

    // Type a search query and click search.
    cy.get("input#search-field").type("api");
    cy.get(`button[aria-label="Sök begrepp"]`).click();

    // Verify that we have 20 results on first page.
    // Also change the default waiting time of 4 seconds from Cypress.
    // We instead set it to  6 seconds. We have to do this due to our slow
    // integration against Entrystore that sometimes can take longer than 4
    // seconds to load the search results completely.
    cy.get("ul.search-result-list", { timeout: 6000 })
      .find("li")
      .should("have.length", 20);

    // verify that url specifies "page 1" and search query "api" after we have done the search.
    cy.url().should("include", "/concepts?p=1&q=api");
  });

  /**
   * Verify that the search filters exist and is usable.
   */
  it("Verify search filter on concepts search result", () => {
    // Go to search page with a search query of "api".
    cy.visit("/sv/concepts?q=api");

    // Verify that we have 20 results on first page.
    // Also change the default waiting time of 4 seconds from Cypress.
    // We instead set it to  6 seconds. We have to do this due to our slow
    // integration against Entrystore that sometimes can take longer than 4
    // seconds to load the search results completely.
    cy.get("ul.search-result-list", { timeout: 6000 })
      .find("li")
      .should("have.length", 20);

    // Get the search result count, so we can check against it later when we add a filter.
    cy.get("h2.search-result-header").then((firstSearchCount) =>
      cy.wrap(firstSearchCount.text()).as("firstSearchCount"),
    );

    // Open search filters.
    cy.get(`#SearchFilters button[aria-label="Visa filter"]`).click();
    cy.get(`#SearchFilters button[aria-label="Dölj filter"]`).should("exist");

    // Verify and open the  filter named "Terminologier".
    cy.get("#SearchFilters button").contains("Terminologier").click();

    // Select one category item.
    cy.get("#SearchFilters button")
      .contains("The GEMET thesaurus - version 4.2.3")
      .click();

    // Close the category filter popup bu clicking it again.
    cy.get("#SearchFilters button").contains("Terminologier").click();

    cy.get("#SearchFilters span.text-textSecondary").contains("Aktiva filter");

    // Verify that we have a different results count after adding a filter.
    cy.get("h2.search-result-header").then((secondSearchCount) =>
      cy.wrap(secondSearchCount.text()).as("secondSearchCount"),
    );
    cy.get("@secondSearchCount").then((secondSearchCount) =>
      cy.get("@firstSearchCount").should("not.equal", secondSearchCount),
    );
  });
});
