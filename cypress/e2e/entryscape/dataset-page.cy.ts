import {
  checkInternalLinkPaths,
  checkNoTemplateLeaks,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
} from "../../support/entryscape";

describe("Dataset page", { testIsolation: false }, () => {
  /**
   * Verify that dataset page is accessible and contains correct elements.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch("/datasets?q=&f=&rt=dataset", "/datasets/");
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display dataset page header and description", () => {
    cy.get("h1", { timeout: 10000 }).should("exist").should("not.be.empty");
    cy.get("[data-test-id='description']", { timeout: 15000 }).should(($el) => {
      expect($el.text().trim()).not.to.equal("");
    });
  });

  it("Should display distributions", () => {
    cy.get("[data-test-id='datasets-block'][data-entryscape='list']", {
      timeout: 15000,
    }).should(($el) => {
      expect($el.text().trim()).not.to.equal("");
    });
  });

  it("Should display about section", () => {
    cy.get("[data-test-id='about-section']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("h2", { timeout: 10000 }).should("not.be.empty");
        cy.get("[data-entryscape='view']", { timeout: 15000 }).should(
          "have.length.gt",
          0,
        );
      });
  });

  it("Should display catalog information", () => {
    cy.get("[data-test-id='catalog-information']", { timeout: 10000 })
      .should("exist")
      .find("h2")
      .should("not.be.empty");
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

  it("Should download RDF file", () => {
    cy.get("[data-test-id='download-formats']", { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get("a").first().click();
        cy.verifyDownload("rdf", { contains: true });
        cy.task("deleteFolder", "cypress//downloads//");
      });
  });
});
