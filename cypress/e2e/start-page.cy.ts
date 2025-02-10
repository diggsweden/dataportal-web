describe("Start page search", () => {
  it("Verify start page has a search form", () => {
    // Gg to start page.
    cy.visit("/", {
      timeout: 120000,
      retryOnNetworkFailure: true,
    });

    // Verify that the search hero heading is present and contains text.
    cy.get("[data-test-id='hero-heading']", { timeout: 10000 })
      .should("exist")
      .should("not.be.empty");

    // Verify that the search field is present and contains placeholder text.
    cy.get("[data-test-id='search-input']", { timeout: 10000 })
      .should("exist")
      .find("input")
      .invoke("attr", "placeholder")
      .should("not.be.empty");

    // Verify that we have a search button.
    cy.get("[data-test-id='search-button']", { timeout: 10000 }).should(
      "exist",
    );

    // Verify that 4 search button is present and contains text.
    cy.get("[data-test-id='hero-search-button']", { timeout: 10000 })
      .should("exist")
      .should("have.length", 4)
      .each(($button) => {
        cy.wrap($button)
          .should("not.be.empty")
          .should("have.attr", "href")
          .should("not.be.empty");
      });
  });
});
