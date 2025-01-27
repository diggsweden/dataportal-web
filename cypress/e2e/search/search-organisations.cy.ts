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
  const SEARCH_INPUT = "api";

  beforeEach(() => {
    cy.visit("/organisations?q=&f=");
    /**
     * Wait for the search button to be visible and not loading.
     * This is to make sure that the search results are loaded.
     */
    cy.get("[data-test-id='search-button']", { timeout: 10000 })
      .should("have.attr", "data-test-loading", "false")
      .should("be.visible");
    cy.wait(1000);
  });

  it("Verify organisations search input", () => {
    // verify H1 text exists and is not empty
    cy.get("h1").should("exist").should("not.be.empty");

    // Verify that the search field is present and contains placeholder text.
    cy.get("[data-test-id='search-input']")
      .should("exist")
      .find("input")
      .invoke("attr", "placeholder")
      .should("not.be.empty");

    // Type a search query and click search.
    cy.get("[data-test-id='search-input']").find("input").type(SEARCH_INPUT);
    cy.get("[data-test-id='search-button']").click();

    // verify that url specifies "page 1" and search query "api" after we have done the search.
    cy.url().should("include", `/organisations?p=1&q=${SEARCH_INPUT}`);
  });

  it("Verify search result list has default 20 results", () => {
    cy.get("[data-test-id='search-result-list']")
      .should("exist")
      .within(() => {
        cy.get("li").should("have.length", 20);
      });
  });

  it("Verify search filters toggle button exists and is expanded by default", () => {
    cy.get("[data-test-id='search-filters']").within(() => {
      cy.get("[data-test-id='search-filters-toggle']")
        .first()
        .as("filterToggle")
        .should("exist")
        .should("have.attr", "aria-expanded", "true");
    });

    // Wait a moment and then click using the alias
    cy.wait(500);
    cy.get("@filterToggle").click();

    cy.get("@filterToggle").should("have.attr", "aria-expanded", "false");
  });

  /**
   * Verify that the search filters exist and is usable.
   */
  it("Verify search filter on organisations search result", () => {
    // Get the search result count, so we can check against it later when we add a filter.
    cy.get("[data-test-id='search-result-header']").then((firstSearchCount) =>
      cy.wrap(firstSearchCount.text()).as("firstSearchCount"),
    );

    // Check that the search filters toggle button exists and is expanded.
    cy.get("[data-test-id='search-filters']").within(() => {
      cy.get("[data-test-id='search-filters-toggle']")
        .first()
        .should("have.attr", "aria-expanded", "true");

      // Click the filter button
      cy.get("[data-test-id='search-filter-select'] button")
        .first()
        .click()
        .should("have.attr", "aria-expanded", "true");

      // Click the first filter button in the list.
      cy.get("[data-test-id='search-filter-select-list']")
        .find("li button")
        .first()
        .click({ force: true });

      // Click the filter button again to close the filter list.
      cy.get("[data-test-id='search-filter-select'] button")
        .first()
        .click()
        .should("have.attr", "aria-expanded", "false");

      cy.get("[data-test-id='search-checkbox-filter']").first().click();

      // Verify that the active filter exists and has the correct count.
      // There are two active filters because one active filter is only shown in mobile view.
      cy.get("[data-test-id='search-active-filters-list']")
        .should("exist")
        .find("button")
        .should("have.length", 6);
    });

    // Verify that we have a different results count after adding a filter.
    cy.get("[data-test-id='search-result-header']").then((secondSearchCount) =>
      cy.wrap(secondSearchCount.text()).as("secondSearchCount"),
    );
    cy.get("@secondSearchCount").then((secondSearchCount) =>
      cy.get("@firstSearchCount").should("not.equal", secondSearchCount),
    );
  });
});
