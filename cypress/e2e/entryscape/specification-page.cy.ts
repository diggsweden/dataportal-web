import {
  block,
  checkFollowLink,
  checkHeader,
  checkInternalLinkPaths,
  checkNoTemplateLeaks,
  checkSpecSectionCounts,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
  openPage,
  SANDBOX_URL,
} from "../../support/entryscape";

describe("Check specification page", { testIsolation: false }, () => {
  /**
   * Verify that specification page is accessible and renders its entryscape blocks.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch("/specifications?q=&f=", "/specifications/");
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display header with publisher", () => {
    checkHeader("specHeader");
    block("specHeader")
      .find("a[href^='/organisations/']")
      .should("not.be.empty");
  });

  it("Should display main content", () => {
    block("specMain").find("h2").should("not.be.empty");
  });

  it("Should display contact publisher block", () => {
    cy.get("[data-test-id='contact-publisher']", { timeout: 10000 }).should(
      "exist",
    );
  });

  it("Should display about section with address", () => {
    cy.get("[data-test-id='about-section']", { timeout: 10000 })
      .find("[data-entryscape='specInfobox']")
      .within(() => {
        cy.get("h2", { timeout: 15000 }).should("not.be.empty");
        cy.get("a[href*='/specifications/']").should("exist");
      });
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

  it("Should open its publisher", () => {
    checkFollowLink(
      "[data-entryscape='specHeader'] a[href^='/organisations/']",
    );
  });
});

describe("Check interoperable specification page", {
  testIsolation: false,
}, () => {
  /**
   * Interoperable specifications (sandbox) list the classes and properties
   * they introduce.
   */
  before(() => {
    ignoreEsjsError();
    openPage(`${SANDBOX_URL}/specifications/inspecTest/midSpec`);
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should list introduced classes and properties", () => {
    block("specMain").within(() => {
      cy.get("a[href^='/class/']").should("have.length.gt", 0);
      cy.get("a[href^='/property/']").should("have.length.gt", 0);
    });
  });

  it("Should link to the application profile", () => {
    block("specInspectAPButton")
      .find("a")
      .should("have.attr", "href")
      .and("match", /\/ap$/);
  });

  it("Should have section counts matching the listed classes and properties", () => {
    checkSpecSectionCounts();
  });

  it("Should not have broken internal link paths", () => {
    checkInternalLinkPaths("[data-entryscape='specMain']");
  });
});
