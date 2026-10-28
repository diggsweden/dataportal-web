import {
  checkInternalLinkPaths,
  checkNoTemplateLeaks,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
} from "../../support/entryscape";

describe("Data service page", { testIsolation: false }, () => {
  /**
   * Verify that data service page is accessible and contains correct elements.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch("/datasets?q=&f=&rt=data_service", "/dataservice/");
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display data service page header and description", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
    cy.get("[data-test-id='description']", { timeout: 15000 }).should(($el) => {
      expect($el.text().trim()).not.to.equal("");
    });
  });

  it("Should display API section", () => {
    cy.get("[data-test-id='api-section']", { timeout: 10000 })
      .should("exist")
      .find("[data-entryscape='view']")
      .should("exist");
  });

  it("Should display contact publisher block", () => {
    cy.get("[data-test-id='contact-publisher']", { timeout: 10000 }).should(
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
