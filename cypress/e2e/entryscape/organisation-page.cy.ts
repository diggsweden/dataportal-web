beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Organisation page", () => {
  /**
   * Verify that organisation page is accessible and contains correct elements.
   */
  const SEARCH_INPUT = "myndighet för digital";

  beforeEach(() => {
    // Go to datasets page search
    cy.visit("/organisations?q=&f=");
    /**
     * Wait for the search button to be visible and not loading.
     * This is to make sure that the search results are loaded.
     */
    cy.get("[data-test-id='search-button']", { timeout: 10000 })
      .should("have.attr", "data-test-loading", "false")
      .should("be.visible");
    cy.wait(1000);

    cy.get("[data-test-id='search-input']").find("input").type(SEARCH_INPUT);
    cy.get("[data-test-id='search-button']").click();

    // Go to first dataset page in the search result list
    cy.get("[data-test-id='search-result-list']", { timeout: 6000 }).within(
      () => {
        cy.get("li").first().click();
      },
    );
  });

  it("Should display organisation page header and description", () => {
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

  it("Should open information modal when clicking on data info button", () => {
    cy.get("[data-test-id='data-info-button']", { timeout: 10000 }).click();
    cy.get("[data-test-id='modal']", { timeout: 10000 })
      .should("exist")
      .should("be.visible");
    cy.get("[data-test-id='modal-close-btn']", { timeout: 10000 }).click();
    cy.get("[data-test-id='modal']", { timeout: 10000 }).should(
      "not.be.visible",
    );
  });

  it("Should display organisation sections and its children", () => {
    cy.get("[data-test-id='organisation-datasets']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("h2").should("not.be.empty");
        cy.get("[data-test-id='organisation-datasets-link']")
          .should("exist")
          .should("have.attr", "href")
          .and("not.be.empty");
      });

    cy.get("[data-test-id='organisation-specifications']").should(($el) => {
      if ($el.length > 0) {
        assert.isNotEmpty($el.find("h2"));
        assert.isNotEmpty(
          $el.find("[data-test-id='organisation-specifications-link']"),
        );
        assert.isNotEmpty(
          $el
            .find("[data-test-id='organisation-specifications-link']")
            .attr("href"),
        );
      }
    });

    cy.get("[data-test-id='organisation-terminology']").should(($el) => {
      if ($el.length > 0) {
        assert.isNotEmpty($el.find("h2"));
        assert.isNotEmpty(
          $el.find("[data-test-id='organisation-terminology-link']"),
        );
        assert.isNotEmpty(
          $el
            .find("[data-test-id='organisation-terminology-link']")
            .attr("href"),
        );
      }
    });
  });

  it("Should display about section", () => {
    cy.get("[data-test-id='about-section']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("h2").should("not.be.empty");

        // Should display contact as a link or paragraph
        cy.get("[data-test-id='contact']", { timeout: 10000 })
          .should("exist")
          .within(($el) => {
            cy.get("h3").should("not.be.empty");
            const hasContactLink = $el.find("a").length > 0;
            if (hasContactLink) {
              cy.wrap($el)
                .find("a")
                .should("have.attr", "href")
                .and("not.be.empty");
            } else {
              cy.wrap($el).find("p").should("not.be.empty");
            }
          });

        // Should display organisation type
        cy.get("[data-test-id='organisation-type']", { timeout: 10000 })
          .should("exist")
          .within(() => {
            cy.get("h3").should("not.be.empty");
            cy.get("p").should("not.be.empty");
          });

        // Should display organisation number
        cy.get("[data-test-id='organisation-number']", {
          timeout: 10000,
        }).should(($el) => {
          if ($el.length > 0) {
            assert.isNotEmpty($el.find("h3"));
            assert.isNotEmpty($el.find("p"));
          }
        });

        cy.get("[data-test-id='mqa-link']", { timeout: 10000 }).should(
          ($el) => {
            if ($el.length > 0) {
              assert.isNotEmpty($el.find("h3"));
              assert.isNotEmpty($el.find("a"));
              assert.isNotEmpty($el.find("a").attr("href"));
            }
          },
        );
      });
  });

  it("Should download RDF file", () => {
    cy.get("[data-test-id='download-formats']")
      .should("exist")
      .within(() => {
        cy.get("a").first().click();
        cy.verifyDownload("rdf", { contains: true });
        cy.task("deleteFolder", "cypress//downloads//");
      });
  });
});
