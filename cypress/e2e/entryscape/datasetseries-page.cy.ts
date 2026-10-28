import {
  checkInternalLinkPaths,
  checkNoTemplateLeaks,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
} from "../../support/entryscape";

describe("Datasetseries page", { testIsolation: false }, () => {
  /**
   * Verify that datasetseries page is accessible and contains correct elements.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch("/datasets?q=&f=&rt=dataset_series", "/dataset-series/");
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display dataset series page header", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
  });

  it("Should display dataset page publisher and datasetseries badge", () => {
    cy.get("[data-test-id='publisher']", { timeout: 10000 }).then(($el) => {
      if ($el.length > 0) {
        expect($el.text().trim()).to.not.be.empty;
      }
    });
    cy.get("[data-test-id='datasetseries-badge']", { timeout: 10000 }).should(
      "exist",
    );
  });

  it("Verify datasetseries page has search results section", () => {
    // The datasetseries page triggers its own inner search via useEffect.
    // Verify the search result header renders (count may be 0 for some series).
    cy.get("[data-test-id='search-result-header']", { timeout: 20000 })
      .should("exist")
      .should("not.be.empty");

    // Verify the result list container exists
    cy.get("[data-test-id='search-result-list']", { timeout: 20000 }).should(
      "exist",
    );
  });

  it("Should show the title of the clicked search hit", () => {
    checkTitleMatchesHit();
  });

  it("Should render without template leaks", () => {
    checkNoTemplateLeaks();
  });

  it("Should not have broken internal link paths", () => {
    checkInternalLinkPaths("main");
  });
});
