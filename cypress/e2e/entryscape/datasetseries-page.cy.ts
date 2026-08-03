beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Datasetseries page", () => {
  /**
   * Verify that datasetseries page is accessible and contains correct elements.
   */
  beforeEach(() => {
    // Go to datasets page search
    cy.visit("/datasets?q=&f=");
    /**
     * Wait for the search button to be visible and not loading.
     * This is to make sure that the search results are loaded.
     */
    cy.get("[data-test-id='search-button']", { timeout: 10000 })
      .should("have.attr", "data-test-loading", "false")
      .should("be.visible");
    cy.wait(1000);

    // Go to first datasetseries page in the search result list
    cy.get("[data-test-id='search-result-list']", { timeout: 10000 }).within(
      () => {
        cy.get("li a").filter('[href^="/dataset-series/"]').first().click();
      },
    );
  });

  it("Should display dataset series page header", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
  });

  it("Should display dataset page publisher and datasetseries badge", () => {
    cy.get("[data-test-id='publisher']", { timeout: 10000 }).then(($el) => {
      if ($el.length > 0) {
        expect($el.text().trim()).to.not.be.empty;
      }
    });
    cy.get("[data-test-id='datasetseries-badge']", { timeout: 10000 }).should(
      "exist",
    );
  });

  it("Verify datasetseries page has search results section", () => {
    // The datasetseries page triggers its own inner search via useEffect.
    // Verify the search result header renders (count may be 0 for some series).
    cy.get("[data-test-id='search-result-header']", { timeout: 20000 })
      .should("exist")
      .should("not.be.empty");

    // Verify the result list container exists
    cy.get("[data-test-id='search-result-list']", { timeout: 20000 }).should(
      "exist",
    );
  });
});
