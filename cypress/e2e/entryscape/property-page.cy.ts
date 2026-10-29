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

describe("Property page", { testIsolation: false }, () => {
  /**
   * Verify that property page is accessible and renders its entryscape blocks.
   */
  before(() => {
    ignoreEsjsError();
    openFromSearch(
      `${SANDBOX_URL}/data-structures?q=&f=&rt=term_property`,
      "/property/",
    );
  });

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Should display header with link to data vocabulary", () => {
    checkHeader("propertyHeader");
    block("propertyHeader")
      .find("a[href^='/data-vocabulary/']")
      .should("not.be.empty");
  });

  it("Should display main content", () => {
    block("propertyMain").find("h2").should("exist");
  });

  it("Should display about section with downloads", () => {
    checkInfobox("propertyInfobox");
  });

  it("Should offer metadata downloads for this entry", () => {
    checkMetadataLinks("propertyInfobox");
  });

  // TODO: unskip when sandbox rdfs-4ab6422ba2 entry 13 tags
  // "har intern referens" @sv (both labels are @en, so hit and h1 differ).
  it.skip("Should show the title of the clicked search hit", () => {
    checkTitleMatchesHit();
  });

  it("Should render without template leaks", () => {
    checkNoTemplateLeaks();
  });

  it("Should not have broken internal link paths", () => {
    checkInternalLinkPaths("main");
  });

  it("Should be listed as introduced by the spec it is introduced in", () => {
    checkIntroducedRoundTrip("propertyMain");
  });

  it("Should open its data vocabulary", () => {
    checkFollowLink(
      "[data-entryscape='propertyHeader'] a[href^='/data-vocabulary/']",
    );
  });
});
