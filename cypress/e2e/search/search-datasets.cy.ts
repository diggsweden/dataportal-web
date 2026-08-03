beforeEach(() => {
  // Ignore a 3rd party library error with message "ReferenceError: ESJS is not defined".
  // We don't want to fail the test due to this so we return false.
  // This is a workaround for the implementation of entryStore (ESJS) in the application.
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
});

describe("Search datasets", () => {
  /**
   * Verify that the search page is accessible and that the search for datasets gives results.
   */
  const SEARCH_INPUT = "api";

  beforeEach(() => {
    cy.visit("/datasets?q=&f=");
    /**
     * Wait for the search button to be visible and not loading.
     * This is to make sure that the search results are loaded.
     */
    cy.get("[data-test-id='search-button']", { timeout: 10000 })
      .should("have.attr", "data-test-loading", "false")
      .should("be.visible");
    cy.wait(1000);
  });

  it("Verify datasets search input", () => {
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
    cy.url().should("include", `/datasets?p=1&q=${SEARCH_INPUT}`);
  });

  it("Verify search result list has default 20 results", () => {
    cy.get("[data-test-id='search-result-list']")
      .should("exist")
      .within(() => {
        cy.get("li").should("have.length", 20);
      });
  });

  it("Verify search filters toggle button exists and is closed by default", () => {
    cy.get("[data-test-id='search-filters']").within(() => {
      cy.get("[data-test-id='search-filters-toggle']")
        .first()
        .as("filterToggle")
        .should("exist")
        .should("have.attr", "aria-expanded", "false");
    });

    // Wait a moment and then click using the alias
    cy.wait(500);
    cy.get("@filterToggle").click();

    cy.get("@filterToggle").should("have.attr", "aria-expanded", "false");
  });

  /**
   * Verify that the active page marking in the pagination follows the user
   * back to page 1.
   *
   * Regression test: `search.request.page` is 0-indexed, so page 1 is stored as
   * 0. The previous logic (`search?.request.page && search?.request.page + 1`)
   * short-circuited on the falsy 0 and passed 0 to <Pagination />, where a
   * second falsy guard kept the active marking stuck on "2".
   */
  it("Verify pagination active page marking returns to page 1", () => {
    // Search for a term that yields enough hits to render more than one page.
    cy.get("[data-test-id='search-input']").find("input").type(SEARCH_INPUT);
    cy.get("[data-test-id='search-button']").click();

    // Wait for the search results to finish loading.
    cy.get("[data-test-id='search-button']", { timeout: 10000 }).should(
      "have.attr",
      "data-test-loading",
      "false",
    );

    cy.get("[data-test-id='pagination']").should("be.visible");

    // Page 1 is the active page when the search results are first rendered.
    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 1"]')
      .should("have.class", "bg-brown-800");

    // Navigate to page 2 and verify that the active marking moves along.
    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 2"]')
      .click();

    cy.url().should("include", "p=2");

    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 2"]')
      .should("have.class", "bg-brown-800");

    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 1"]')
      .should("not.have.class", "bg-brown-800");

    // Navigate back to page 1 and verify that the active marking returns
    // instead of getting stuck on page 2.
    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 1"]')
      .click();

    cy.url().should("include", "p=1");

    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 1"]')
      .should("have.class", "bg-brown-800");

    cy.get("[data-test-id='pagination']")
      .find('button[aria-label="sida 2"]')
      .should("not.have.class", "bg-brown-800");
  });
});
