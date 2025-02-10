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

    // Go to first dataset page in the search result list
    cy.get("[data-test-id='search-result-list']", { timeout: 10000 }).within(
      () => {
        cy.get("li a", { timeout: 10000 })
          .filter('[href^="/datasets/"]')
          .first()
          .click();
      },
    );
  });

  it("Should display dataset page header and description", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
    cy.get("[data-test-id='description']", { timeout: 10000 }).should(($el) => {
      // If description exists, verify it has content
      if ($el.length > 0) {
        cy.wrap($el)
          .should("not.be.empty")
          .invoke("text")
          .should("have.length.gt", 0);
      }
    });
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

  it("Should display datasets block and its children", () => {
    cy.get("[data-test-id='indicators']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("span").should("have.length.gt", 0);
      });

    cy.get("[data-test-id='datasets-block']", { timeout: 10000 }).should(
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
        cy.get("h2", { timeout: 10000 }).should("not.be.empty");
      });

    cy.get("[data-test-id='catalog-information']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("h2", { timeout: 10000 }).should("not.be.empty");
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
