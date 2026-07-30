beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Dataset page", () => {
  /**
   * Verify that dataset page is accessible and contains correct elements.
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

    // Click the first search result link (any type — dataset, data service, or dataset series)
    cy.get("[data-test-id='search-result-list']", { timeout: 10000 }).within(
      () => {
        cy.get("li a").first().click();
      },
    );
  });

  it("Should display dataset page header", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
  });

  it("Should display publisher information correctly", () => {
    cy.get("[data-test-id='publisher']", { timeout: 10000 }).should(($el) => {
      if ($el.length > 0) {
        // If publisher exists, it must be either a link or paragraph
        if ($el.is("a")) {
          assert.isNotEmpty($el.attr("href"));
        } else if ($el.is("div")) {
          assert.isNotEmpty($el.text().trim());
        } else {
          throw new Error(
            "Publisher element must be either a link or paragraph",
          );
        }
      }
    });
  });

  it("Should display about section", () => {
    cy.get("[data-test-id='about-section']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("h2", { timeout: 10000 }).should("not.be.empty");
      });
  });
});
