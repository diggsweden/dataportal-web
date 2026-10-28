import {
  ignoreEsjsError,
  SANDBOX_URL,
  visitSearch,
} from "../../support/entryscape";

describe("Search data structures", () => {
  /**
   * Verify that the data structures search gives results and that the type
   * filters only return their own type.
   */
  const SEARCH_INPUT = "api";
  const SEARCH_URL = `${SANDBOX_URL}/data-structures?q=&f=`;

  beforeEach(() => {
    ignoreEsjsError();
  });

  it("Verify data structures search input", () => {
    visitSearch(SEARCH_URL);

    // verify H1 text exists and is not empty
    cy.get("h1").should("exist").should("not.be.empty");

    // Verify that the search field is present and contains placeholder text.
    cy.get("[data-test-id='search-input']")
      .should("exist")
      .find("input")
      .invoke("attr", "placeholder")
      .should("not.be.empty");

    // Type a search query and click search.
    cy.get("[data-test-id='search-input']").find("input").type(SEARCH_INPUT);
    cy.get("[data-test-id='search-button']").click();

    // verify that url specifies "page 1" and search query "api" after we have done the search.
    cy.url().should("include", `/data-structures?p=1&q=${SEARCH_INPUT}`);
  });

  it("Verify search result list has default 20 results", () => {
    visitSearch(SEARCH_URL);
    cy.get("[data-test-id='search-result-list'] > li").should(
      "have.length",
      20,
    );
  });

  it("Verify search filters toggle button exists and toggles", () => {
    visitSearch(SEARCH_URL);
    cy.get("[data-test-id='search-filters']").within(() => {
      cy.get("[data-test-id='search-filters-toggle']")
        .first()
        .as("filterToggle")
        .should("exist");
    });

    // Click the toggle and verify that aria-expanded changes
    cy.wait(500);
    cy.get("@filterToggle")
      .invoke("attr", "aria-expanded")
      .then((expanded) => {
        cy.get("@filterToggle").click();
        const expected = expanded === "true" ? "false" : "true";
        cy.get("@filterToggle").should("have.attr", "aria-expanded", expected);
      });
  });

  for (const [type, path] of [
    ["term", "/concepts/"],
    ["term_class", "/class/"],
    ["term_property", "/property/"],
  ]) {
    it(`Verify "${type}" filter only returns ${path} hits`, () => {
      visitSearch(`${SEARCH_URL}&rt=${type}`);
      cy.get("[data-test-id='search-result-list'] > li").each(($li) => {
        expect($li.find(`a[href^='${path}']`)).to.have.length.gt(0);
      });
    });
  }
});
