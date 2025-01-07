beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Search organisations", () => {
  /**
   * Verify that the search page is accessible and that the search for organisations gives results.
   */
  it("Verify organisations search result", () => {
    // Gg to searchpage
    cy.visit("/sv/organisations");

    // verify H1 text
    cy.get("h1").contains("Sök organisationer");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#search-field")
      .invoke("attr", "placeholder")
      .should("contain", "Sök organisationer");

    // Type a search query and click search.
    cy.get("input#search-field").type("kommun");
    cy.get(`button[aria-label="Sök organisationer"]`).click();

    // Verify that we have 20 results on first page.
    // Also change the default waiting time of 4 seconds from Cypress.
    // We instead set it to  6 seconds. We have to do this due to our slow
    // integration against Entrystore that sometimes can take longer than 4
    // seconds to load the search results completely.
    cy.get("ul.search-result-list", { timeout: 6000 })
      .find("li")
      .should("have.length", 20);

    // verify that url specifies "page 1" and search query "kommun" after we have done the search.
    cy.url().should("include", "/organisations?p=1&q=kommun");
  });

  /**
   * Verify that the search filters exist and is usable.
   */
  it("Verify search filter on organisations search result", () => {
    // Go to search page with a search query of "kommun".
    cy.visit("/sv/organisations?q=kommun");

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
    cy.get(`#SearchFilters button[aria-label="Visa filter"]`).first().click();
    cy.get(`#SearchFilters button[aria-label="Dölj filter"]`).should("exist");

    // Verify filter buttons.
    cy.get("#SearchFilters button").contains("Organisationstyp");
    // Open the first filter named "Organisationstyp".
    cy.get("#SearchFilters button").contains("Organisationstyp").click();

    // Close the category filter popup bu clicking it again.
    cy.get("#SearchFilters button").contains("Organisationstyp").click();
  });
});
