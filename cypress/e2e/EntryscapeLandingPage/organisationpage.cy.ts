beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Check organisation page", () => {
  it("Verify organisation page route and check data", () => {
    // Go to searchpage
    cy.visit("/sv/organisations");

    // verify H1 text
    cy.get("h1").contains("Sök organisationer");

    // Verify that the search field is present and contains correct placeholder text.
    cy.get("input#search-field")
      .invoke("attr", "placeholder")
      .should("contain", "Sök organisationer");

    // Type a search query and click search + find first result and click.
    cy.get("input#search-field", { timeout: 6000 }).type("kommun");

    cy.get(`button[aria-label="Sök organisationer"]`)
      .click()
      .then(() => {
        cy.reload();
        cy.get("ul.search-result-list", { timeout: 6000 })
          .find("li")
          .first()
          .click();
      });

    // Check for heading
    cy.get("h1").should("exist");

    // Check for organisation data
    cy.get("h2").should("contain", "Datamängder");
    cy.get("span").should("contain", "Antal datamängder");
    cy.get("span").should("contain", "Öppna datamängder");
    cy.get("span").should("contain", "Skyddade datamängder");
    cy.get("span").should("contain", "Datamängder med API");
    cy.get("span").should("contain", "Värdefulla datamängder");
    cy.get("span").should("contain", "Avgiftsbelagda datamängder");
    cy.get("span").should("contain", "Datamängder som följer specifikation");
  });
});
