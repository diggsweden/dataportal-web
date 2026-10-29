import {
  block,
  checkInternalLinkPaths,
  checkNoTemplateLeaks,
  ignoreEsjsError,
  SANDBOX_URL,
} from "../../support/entryscape";

describe("Application profile page", { testIsolation: false }, () => {
  /**
   * Verify that the application profile page opens from its specification
   * and renders the apView block. Uses a sandbox test specification.
   */
  let specTitle = "";

  before(() => {
    ignoreEsjsError();
    cy.visit(`${SANDBOX_URL}/specifications/inspecTest/midSpec`);
    block("specHeader")
      .find("h1")
      .invoke("text")
      .then((text) => {
        specTitle = text.trim();
      });
    block("specInspectAPButton").find("a").click();
    cy.location("pathname", { timeout: 10000 }).should("match", /\/ap$/);
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display the same title as its specification", () => {
    // apView re-renders, so query the h1 directly instead of chaining
    cy.get("[data-entryscape='apView'] h1", { timeout: 15000 }).should(
      ($h1) => {
        expect($h1.text().trim()).to.equal(specTitle);
      },
    );
  });

  it("Should display table of contents", () => {
    block("apView").find("a[href='#toc']").should("exist");
  });

  it("Should render without template leaks", () => {
    checkNoTemplateLeaks();
  });

  it("Should not have broken internal link paths", () => {
    checkInternalLinkPaths("[data-entryscape='apView']");
  });
});
