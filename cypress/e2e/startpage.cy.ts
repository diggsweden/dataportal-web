describe("Start page search", () => {
  it("Verify start page has a search form", () => {
    // Gg to start page.
    cy.visit("/");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#start-search")
      .invoke("attr", "placeholder")
      .should("contain", "Sök data och API:er");

    // Verify that we have a search button.
    cy.get("#SearchHero button span").contains("Sök");
  });
});
