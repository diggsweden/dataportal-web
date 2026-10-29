import {
  block,
  checkFollowLink,
  checkHeader,
  checkInfobox,
  checkInternalLinkPaths,
  checkMetadataLinks,
  checkNoTemplateLeaks,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
  SANDBOX_URL,
} from "../../support/entryscape";

describe("Concept page", { testIsolation: false }, () => {
  /**
   * Verify that concept page is accessible and renders its entryscape blocks.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch(
      `${SANDBOX_URL}/data-structures?q=&f=&rt=term`,
      "/concepts/",
    );
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display header with link to terminology", () => {
    checkHeader("conceptHeader");
    block("conceptHeader")
      .find("a[href^='/terminology/']")
      .should("exist")
      .should("not.be.empty");
  });

  it("Should display main content", () => {
    block("conceptMain").find("h2").should("exist");
  });

  it("Should display concept hierarchy", () => {
    cy.get("[data-entryscape='hierarchy'] svg", { timeout: 15000 }).should(
      "exist",
    );
  });

  it("Should display about section with downloads", () => {
    checkInfobox("conceptInfobox");
  });

  it("Should offer metadata downloads for this entry", () => {
    checkMetadataLinks("conceptInfobox");
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

  it("Should open its terminology", () => {
    checkFollowLink(
      "[data-entryscape='conceptHeader'] a[href^='/terminology/']",
    );
  });
});
