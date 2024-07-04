describe("Check tools and support page", () => {
  it("Verify correct routing", () => {
    // Open sidemeny on landingpage and navigate to Tools and support
    cy.visit("/sv");
    cy.get('button[aria-label="Meny"]').click();
    cy.get('a[href="/stod-och-verktyg"]')
      .should("be.visible")
      .first()
      .click({ force: true });

    // Assert that the URL is correct after navigation
    cy.url().should("include", "/stod-och-verktyg");

    // Verify headings and tools and support block
    cy.get("h1").should("contain", "Stöd och verktyg");
    cy.get("h2").should("contain", "Stöd och verktyg");

    // Use filter and click on preview
    cy.get('button[aria-label="Stöd för API-utveckling"]').click();
    cy.get('a[href="/rest-api-profil"]')
      .first()
      .within(() => {
        cy.get("span").contains(" Förhandsgrandska").click();
      });

    // Navigate to choosen tools and support box and verify routing
    cy.get('a[aria-label="Till sidan"]').first().click();
    cy.url().should("include", "/rest-api-profil");
  });
});
