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

    // Go to first datasetseries page in the search result list
    cy.get("[data-test-id='search-result-list']", { timeout: 8000 }).within(
      () => {
        cy.get("li a").filter('[href^="/dataset-series/"]').first().click();
      },
    );
  });

  it("Should display dataset page header and description", () => {
    cy.get("h1").should("exist").should("not.be.empty");
    cy.get("[data-test-id='description']").should(($el) => {
      // If description exists, verify it has content
      if ($el.length > 0) {
        cy.wrap($el)
          .should("not.be.empty")
          .invoke("text")
          .should("have.length.gt", 0);
      }
    });
  });

  it("Should display dataset page publisher and datasetseries badge", () => {
    cy.get("[data-test-id='publisher']").should(($el) => {
      // If publisher exists, verify it has content
      if ($el.length > 0) {
        cy.wrap($el).should("not.be.empty");
      }
    });
    cy.get("[data-test-id='datasetseries-badge']").should("exist");
  });

  it("Verify datasetseries page lists datasets", () => {
    cy.get("[data-test-id='search-result-header']", { timeout: 8000 })
      .should("exist")
      .should("not.be.empty");

    cy.get("[data-test-id='search-result-list']", { timeout: 8000 })
      .should("exist")
      .find("li")
      .should("have.length.gt", 0);

    // Check for sort and filter buttons
    cy.get("button#sort").should("exist");
  });
});
