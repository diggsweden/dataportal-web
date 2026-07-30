beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Search organisations", () => {
  /**
   * Verify that the search page is accessible and that the search for organisations gives results.
   */
  const SEARCH_INPUT = "api";

  beforeEach(() => {
    cy.visit("/organisations?q=&f=");
    /**
     * Wait for the search button to be visible and not loading.
     * This is to make sure that the search results are loaded.
     */
    cy.get("[data-test-id='search-button']", { timeout: 10000 })
      .should("have.attr", "data-test-loading", "false")
      .should("be.visible");
    cy.wait(1000);
  });

  it("Verify organisations search input", () => {
    // verify H1 text exists and is not empty
    cy.get("h1").should("exist").should("not.be.empty");

    // Verify that the search field is present and contains placeholder text.
    cy.get("[data-test-id='search-input']")
      .should("exist")
      .find("input")
      .invoke("attr", "placeholder")
      .should("not.be.empty");

    // Type a search query and click search.
    cy.get("[data-test-id='search-input']").find("input").type(SEARCH_INPUT);
    cy.get("[data-test-id='search-button']").click();

    // verify that url specifies "page 1" and search query "api" after we have done the search.
    cy.url().should("include", `/organisations?p=1&q=${SEARCH_INPUT}`);
  });

  it("Verify search result list has default 20 results", () => {
    cy.get("[data-test-id='search-result-list']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("li").should("have.length", 20);
      });
  });

  it("Verify search filters toggle button exists and toggles", () => {
    cy.get("[data-test-id='search-filters']").within(() => {
      cy.get("[data-test-id='search-filters-toggle']")
        .first()
        .as("filterToggle")
        .should("exist");
    });

    // Click the toggle and verify that aria-expanded changes
    cy.wait(500);
    cy.get("@filterToggle")
      .invoke("attr", "aria-expanded")
      .then((expanded) => {
        cy.get("@filterToggle").click();
        const expected = expanded === "true" ? "false" : "true";
        cy.get("@filterToggle").should("have.attr", "aria-expanded", expected);
      });
  });
});
