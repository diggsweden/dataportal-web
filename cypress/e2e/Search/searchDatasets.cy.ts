beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Search datasets", () => {
  /**
   * Verify that the search page is accessible and that the search for datasets gives results.
   */
  it("Verify datasets search result", () => {
    // Gg to searchpage
    cy.visit("/sv/datasets");

    // verify H1 text
    cy.get("h1").contains("Sök data & API:er");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#search-field")
      .invoke("attr", "placeholder")
      .should("contain", "Sök Data & Api:er");

    // Type a search query and click search.
    cy.get("input#search-field").type("api");
    cy.get(`button[aria-label="Sök"]`).click();

    // Verify that we have 20 results on first page.
    // Also change the default waiting time of 4 seconds from Cypress.
    // We instead set it to  6 seconds. We have to do this due to our slow
    // integration against Entrystore that sometimes can take longer than 4
    // seconds to load the search results completely.
    cy.get("ul.search-result-list", { timeout: 6000 })
      .find("li")
      .should("have.length", 20);

    // verify that url specifies "page 1" and search query "api" after we have done the search.
    cy.url().should("include", "/datasets?p=1&q=api");
  });

  /**
   * Verify that the search filters exist and is usable.
   */
  it("Verify search filter on datasets search result", () => {
    // Go to search page with a search query of "api".
    cy.visit("/sv/datasets?q=api");

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

    // Verify filter buttons.
    cy.get("#SearchFilters button").contains("Organisationstyp");
    cy.get("#SearchFilters button").contains("Organisation");
    cy.get("#SearchFilters button").contains("Format");
    cy.get("#SearchFilters button").contains("Uppdateringsfrekvens");
    cy.get("#SearchFilters button").contains("Licens");
    // Open the first filter named "Kategori".
    cy.get("#SearchFilters button").contains("Kategori").click();

    // Select one category item.
    cy.get("#SearchFilters button").contains("Befolkning och samhälle").click();

    // Close the category filter popup bu clicking it again.
    cy.get("#SearchFilters button").contains("Kategori").click();

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
