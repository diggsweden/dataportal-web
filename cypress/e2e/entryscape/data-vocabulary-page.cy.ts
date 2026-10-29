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

describe("Data vocabulary page", { testIsolation: false }, () => {
  /**
   * Verify that data vocabulary page is accessible and renders its entryscape blocks.
   * Class hits link to their data vocabulary.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch(
      `${SANDBOX_URL}/data-structures?q=&f=&rt=term_class`,
      "/data-vocabulary/",
    );
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display header with publisher", () => {
    checkHeader("datavocHeader");
    block("datavocHeader")
      .find("a[href^='/organisations/']")
      .should("not.be.empty");
  });

  it("Should list classes and link to all classes", () => {
    block("datavocMain").within(() => {
      cy.get("h2").should("not.be.empty");
      cy.get("a[href^='/class/']").should("have.length.gt", 0);
      cy.get("a[href^='/data-structures']")
        .first()
        .should("have.attr", "href")
        .and("include", "rt=term_class");
    });
  });

  it("Should display about section with downloads", () => {
    checkInfobox("datavocInfobox");
  });

  it("Should offer metadata downloads for this entry", () => {
    checkMetadataLinks("datavocInfobox");
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

  it("Should have class and property counts matching their searches", () => {
    checkShowAllCounts("datavocMain");
  });

  it("Should open one of its classes", () => {
    checkFollowLink("[data-entryscape='datavocMain'] a[href^='/class/']");
  });
});
