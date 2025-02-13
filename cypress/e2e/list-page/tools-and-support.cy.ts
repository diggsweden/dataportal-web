describe("Check tools and support page", () => {
  beforeEach(() => {
    cy.visit("/stod-och-verktyg");
  });

  it("Verify headings and list filters", () => {
    cy.get("h1").should("exist").should("not.be.empty");

    cy.get("[data-test-id='list-page']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("[data-test-id='list-page-heading']")
          .should("exist")
          .should("not.be.empty");

        cy.get("[data-test-id='list-filters']").should(($el) => {
          if ($el.length > 0) {
            assert.isAtLeast($el.find("button").length, 1);
          }
        });
      });
  });

  it("Verify grid list", () => {
    cy.get("[data-test-id='grid-list-container']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        // Check if either grid-list or grid-list-empty exists
        cy.get("[data-test-id='grid-list'], [data-test-id='grid-list-empty']")
          .should("exist")
          .should("have.length", 1);

        // If grid-list exists, verify it has maximum 20 teasers
        cy.get("[data-test-id='grid-list']").then(($gridList) => {
          if ($gridList.length > 0) {
            cy.get("[data-test-id='tool-teaser']").should(
              "have.length.at.most",
              20,
            );
          }
        });
      });

    // Get the total count from the heading outside grid-list-container
    cy.get("[data-test-id='list-page-heading']", { timeout: 10000 })
      .invoke("text")
      .then((text) => {
        // Extract number from heading (assuming format like "XX results" or similar)
        const count = parseInt(text.match(/\d+/)?.[0] ?? "0");

        if (count > 20) {
          // Verify pagination exists when total count exceeds 20
          cy.get("[data-test-id='pagination']").should("exist");
        }
      });
  });

  it("Verify tool teaser component", () => {
    cy.get("[data-test-id='tool-teaser']", { timeout: 10000 }).each(
      ($teaser) => {
        cy.wrap($teaser).within(() => {
          cy.get("[data-test-id='tool-teaser-link']")
            .invoke("attr", "href")
            .then((href) => {
              cy.get("[data-test-id='tool-teaser-link']")
                .invoke("attr", "data-test-is-external")
                .then((isExternal) => {
                  if (isExternal === "true") {
                    expect(href).to.match(/^https?:\/\//);
                  } else {
                    expect(href).to.match(/^\//);
                  }
                });
            });

          cy.get("[data-test-id='tool-teaser-domain-label']")
            .should("exist")
            .should("not.be.empty");

          cy.get("[data-test-id='tool-teaser-icon']")
            .should("exist")
            .should("not.be.empty");

          cy.get("[data-test-id='tool-teaser-heading']")
            .should("exist")
            .should("not.be.empty");

          cy.get("[data-test-id='tool-teaser-preamble']")
            .should("exist")
            .should("not.be.empty");

          cy.get("[data-test-id='tool-teaser-preview-button']").should("exist");
        });
      },
    );
  });

  it("Verify that modal opens when clicking on preview button", () => {
    cy.get("[data-test-id='modal']", { timeout: 10000 })
      .first()
      .should("not.be.visible");
    cy.get("[data-test-id='tool-teaser-preview-button']").first().click();
    cy.get("[data-test-id='modal']").first().should("be.visible");

    cy.get("[data-test-id='modal']")
      .first()
      .should("exist")
      .within(() => {
        cy.get("[data-test-id='modal-close-btn']").should("exist").click();
      });

    cy.get("[data-test-id='modal']").first().should("not.be.visible");
  });
});
