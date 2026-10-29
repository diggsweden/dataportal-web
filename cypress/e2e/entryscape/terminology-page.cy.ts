import {
  block,
  checkFollowLink,
  checkHeader,
  checkInfobox,
  checkInternalLinkPaths,
  checkMetadataLinks,
  checkNoTemplateLeaks,
  checkShowAllCounts,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
  SANDBOX_URL,
} from "../../support/entryscape";

describe("Terminology page", { testIsolation: false }, () => {
  /**
   * Verify that terminology page is accessible and renders its entryscape blocks.
   * Concept hits link to their terminology.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch(
      `${SANDBOX_URL}/data-structures?q=&f=&rt=term`,
      "/terminology/",
    );
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display header with publisher", () => {
    checkHeader("terminologyHeader");
    block("terminologyHeader")
      .find("a[href^='/organisations/']")
      .should("not.be.empty");
  });

  it("Should list concepts and link to all concepts", () => {
    block("terminologyMain").within(() => {
      cy.get("h2").should("not.be.empty");
      cy.get("a[href^='/concepts/']").should("have.length.gt", 0);
      cy.get("a[href^='/data-structures']")
        .should("have.attr", "href")
        .and("include", "rt=term");
    });
  });

  it("Should display about section with downloads", () => {
    checkInfobox("terminologyInfobox");
  });

  it("Should offer metadata downloads for this entry", () => {
    checkMetadataLinks("terminologyInfobox");
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

  it("Should have concept count matching its search", () => {
    checkShowAllCounts("terminologyMain");
  });

  it("Should open one of its concepts", () => {
    checkFollowLink(
      "[data-entryscape='terminologyMain'] a[href^='/concepts/']",
    );
  });
});
