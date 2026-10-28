import {
  block,
  checkFollowLink,
  checkHeader,
  checkInfobox,
  checkInternalLinkPaths,
  checkIntroducedRoundTrip,
  checkMetadataLinks,
  checkNoTemplateLeaks,
  checkTitleMatchesHit,
  ignoreEsjsError,
  openFromSearch,
  SANDBOX_URL,
} from "../../support/entryscape";

describe("Class page", { testIsolation: false }, () => {
  /**
   * Verify that class page is accessible and renders its entryscape blocks.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch(
      `${SANDBOX_URL}/data-structures?q=&f=&rt=term_class`,
      "/class/",
    );
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display header with link to data vocabulary", () => {
    checkHeader("classHeader");
    block("classHeader")
      .find("a[href^='/data-vocabulary/']")
      .should("not.be.empty");
  });

  it("Should display main content", () => {
    block("classMain").find("h2").should("exist");
  });

  it("Should display about section with downloads", () => {
    checkInfobox("classInfobox");
  });

  it("Should offer metadata downloads for this entry", () => {
    checkMetadataLinks("classInfobox");
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

  it("Should be listed as introduced by the spec it is introduced in", () => {
    checkIntroducedRoundTrip("classMain");
  });

  it("Should open its data vocabulary", () => {
    checkFollowLink(
      "[data-entryscape='classHeader'] a[href^='/data-vocabulary/']",
    );
  });
});
