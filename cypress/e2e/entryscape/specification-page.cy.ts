beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Check specification page", () => {
  /**
   * Verify that specification page is accessible and contains correct elements.
   */
  beforeEach(() => {
    // Go to specifications page search
    cy.visit("/specifications?q=&f=");
    /**
     * Wait for the search button to be visible and not loading.
     * This is to make sure that the search results are loaded.
     */
    cy.get("[data-test-id='search-button']", { timeout: 10000 })
      .should("have.attr", "data-test-loading", "false")
      .should("be.visible");
    cy.wait(1000);

    // Go to first specification page in the search result list
    cy.get("[data-test-id='search-result-list']", { timeout: 10000 }).within(
      () => {
        cy.get("li a").first().click();
      },
    );
  });

  it("Should display specification page header and description", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
    cy.get("[data-test-id='description']", { timeout: 10000 })
      .should("exist")
      .should("not.be.empty");
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

  it("Should display specification block and its children", () => {
    cy.get("[data-test-id='resource-descriptors']", { timeout: 10000 }).should(
      "exist",
    );

    cy.get("[data-test-id='contact-publisher']", { timeout: 10000 }).should(
      "exist",
    );
  });

  it("Should display about section", () => {
    cy.get("[data-test-id='about-section']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("h2").should("not.be.empty");

        cy.get("[data-test-id='address']")
          .should("exist")
          .within(() => {
            cy.get("h3").should("not.be.empty");
            cy.get("a").should("have.attr", "href").and("not.be.empty");
          });
      });
  });

  it("Should download RDF file", () => {
    cy.get("[data-test-id='download-formats']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("a").first().click();
        cy.verifyDownload("rdf", { contains: true });
        cy.task("deleteFolder", "cypress//downloads//");
      });
  });
});
