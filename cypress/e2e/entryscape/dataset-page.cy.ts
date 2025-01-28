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

    // Go to first dataset page in the search result list
    cy.get("[data-test-id='search-result-list']", { timeout: 8000 }).within(
      () => {
        cy.get("li a").filter('[href^="/datasets/"]').first().click();
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

  it("Should display publisher information correctly", () => {
    cy.get("[data-test-id='publisher']").should(($el) => {
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
    cy.get("[data-test-id='indicators']", { timeout: 8000 })
      .should("exist")
      .within(() => {
        cy.get("span").should("have.length.gt", 0);
      });

    cy.get("[data-test-id='datasets-block']").should("exist");

    cy.get("[data-test-id='contact-publisher']").should("exist");
  });

  it("Should display about section", () => {
    cy.get("[data-test-id='about-section']")
      .should("exist")
      .within(() => {
        cy.get("h2").should("not.be.empty");
      });

    cy.get("[data-test-id='catalog-information']")
      .should("exist")
      .within(() => {
        cy.get("h2").should("not.be.empty");
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
