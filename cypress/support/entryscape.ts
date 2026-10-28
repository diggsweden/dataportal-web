/**
 * Shared helpers for pages rendered with entryscape blocks.
 *
 * Blocks keep their `data-entryscape="<name>"` attribute after rendering, so
 * tests target blocks by name rather than by data-test-id.
 */

// Data structures (concepts, classes, properties, vocabularies) and application
// profiles only exist in sandbox. A `sandbox` host switches the app's entrystore.
export const SANDBOX_URL: string = Cypress.env("sandboxUrl");

/** Ignore the 3rd party "ESJS is not defined" error from entryStore. */
export function ignoreEsjsError() {
  cy.on("uncaught:exception", (e) => {
    return !e.message.includes("ESJS is not defined");
  });
}

/** Visit a search page and wait until it has rendered hits. */
export function visitSearch(url: string) {
  cy.visit(url);
  cy.get("[data-test-id='search-button']", { timeout: 10000 })
    .should("have.attr", "data-test-loading", "false")
    .should("be.visible");
  cy.get("[data-test-id='search-result-list'] li", { timeout: 10000 }).should(
    "have.length.gt",
    0,
  );
}

/**
 * The page under test. Specs open it once in `before()` with
 * `testIsolation: false`, so every test reuses it instead of loading it again:
 * each load queries the entrystore, which blocks IPs that send too much.
 */
const page = { url: "", hitTitle: "" };

/** Open a page once per spec, keeping its URL for `returnToPage`. */
export function openPage(url: string) {
  cy.visit(url);
  cy.location("href").then((href) => {
    page.url = href;
  });
}

/** Open the first hit for `prefix` from a search, once per spec. */
export function openFromSearch(searchUrl: string, prefix: string) {
  visitSearch(searchUrl);
  const hit = `[data-test-id='search-result-list'] li a[href^='${prefix}']`;
  cy.get(hit)
    .first()
    .invoke("text")
    .then((text) => {
      page.hitTitle = text.trim();
    });
  cy.get(hit).first().click();
  cy.location("pathname", { timeout: 10000 }).should("include", prefix);
  cy.location("href").then((href) => {
    page.url = href;
  });
}

/** Go back to the page under test if an earlier test navigated away. */
export function returnToPage() {
  cy.location("href").then((href) => {
    if (href !== page.url) cy.visit(page.url);
  });
}

/** Get a block by name once it has rendered content. */
export function block(name: string) {
  return cy
    .get(`[data-entryscape='${name}']`, { timeout: 15000 })
    .should(($el) => {
      expect($el.text().trim()).not.to.equal("");
    });
}

/** Header block: non-empty h1. */
export function checkHeader(name: string) {
  block(name).find("h1").should("not.be.empty");
}

/** Infobox block inside the about section: heading and metadata downloads. */
export function checkInfobox(name: string) {
  cy.get("[data-test-id='about-section']", { timeout: 15000 })
    .find(`[data-entryscape='${name}']`)
    .should(($el) => {
      expect($el.text().trim()).not.to.equal("");
    })
    .within(() => {
      cy.get("h2").should("not.be.empty");
      cy.get("a[href*='merged-metadata']").should("have.length.gte", 4);
    });
}

// Rendering bugs we have seen: unrendered templates and stringified values.
const TEMPLATE_LEAK = /\{\{|\}\}|\bundefined\b|\bNaN\b|\[object Object\]/;

// A link path built from missing data, e.g. `/class/undefined` or `/class/`.
const BROKEN_PATH = /undefined|null|NaN|\{\{|%7B%7B|\[object|\/\/|.\/$/;

/** h1 and document title match the search hit that was clicked. */
export function checkTitleMatchesHit() {
  cy.get("h1", { timeout: 15000 }).should(($h1) => {
    expect($h1.text().trim()).to.equal(page.hitTitle);
  });
  cy.title().should("equal", `${page.hitTitle} - Sveriges dataportal`);
}

/** No raw template syntax or stringified JS values in the page. */
export function checkNoTemplateLeaks() {
  cy.get("main").invoke("text").should("not.match", TEMPLATE_LEAK);
}

/** Internal link paths inside `selector` are not built from missing data. */
export function checkInternalLinkPaths(selector: string) {
  cy.get(`${selector} a[href^='/']`, { timeout: 15000 }).each(($a) => {
    const href = $a.attr("href") as string;
    const path = href.split(/[?#]/)[0];
    expect(path, href).not.to.match(BROKEN_PATH);
  });
}

/**
 * Click the first link matching `selector`; the page it opens has the link
 * text as its h1.
 */
export function checkFollowLink(selector: string) {
  returnToPage();
  cy.get(selector, { timeout: 15000 })
    .first()
    .then(($a) => {
      const text = $a.text().trim();
      const prefix = `/${($a.attr("href") as string).split("/")[1]}/`;

      cy.get(selector).first().click();
      cy.location("pathname", { timeout: 10000 }).should("include", prefix);
      cy.get("h1", { timeout: 15000 }).should(($h1) => {
        expect($h1.text().trim()).to.equal(text);
      });
    });
}

/** Total hits shown in the search result header. */
export function searchResultCount(): Cypress.Chainable<number> {
  return cy
    .get("[data-test-id='search-result-header'] span[aria-hidden]", {
      timeout: 15000,
    })
    .invoke("text")
    .should("match", /^\d+ /)
    .then((text) => parseInt(String(text), 10));
}

/**
 * "I … ingår N klasser" headings match the number of hits behind their
 * "Visa alla …" search link.
 */
export function checkShowAllCounts(name: string) {
  returnToPage();
  // Lists render after the headings; wait for the links.
  cy.get(`[data-entryscape='${name}'] a[href^='/data-structures']`, {
    timeout: 15000,
  }).should("exist");
  block(name).then(($block) => {
    const pairs: { count: number; href: string }[] = [];
    let count: number | undefined;
    for (const el of $block.find("h2, a[href^='/data-structures']").toArray()) {
      if (el.tagName === "H2") {
        const match = el.textContent?.match(/\d+/);
        count = match ? parseInt(match[0], 10) : undefined;
      } else if (count !== undefined) {
        pairs.push({ count, href: el.getAttribute("href") as string });
      }
    }
    expect(pairs, "show-all links with counts").to.have.length.gt(0);

    cy.location("origin").then((origin) => {
      for (const { count: expected, href } of pairs) {
        visitSearch(`${origin}${href}`);
        searchResultCount().should("equal", expected);
      }
    });
  });
}

/**
 * Each "N introducerade/återanvända …" section in specMain lists N links
 * (capped by the block's limit of 20).
 */
export function checkSpecSectionCounts() {
  block("specMain")
    .find("details:has(h3.esbResults)")
    .should("have.length.gt", 0)
    .each(($section) => {
      const heading = $section.find("h3").text();
      const count = parseInt(heading.match(/\d+/)?.[0] ?? "", 10);
      const links = $section.find("a[href^='/class/'], a[href^='/property/']");
      expect(links.length, heading.trim()).to.equal(Math.min(count, 20));
    });
}

/**
 * The spec a class/property says it is introduced in lists it back as
 * introduced.
 */
export function checkIntroducedRoundTrip(mainBlock: string) {
  returnToPage();
  cy.location("pathname").then((ownPath) => {
    block(mainBlock)
      .find("h2:contains('Introduceras i') + div a[href^='/specifications/']")
      .first()
      .click();
    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      "/specifications/",
    );
    block("specMain")
      .find("details:has(h3:contains('introducerade'))")
      .find(`a[href='${ownPath}']`)
      .should("exist");
  });
}

/**
 * Infobox offers the entry's metadata in all formats, all pointing at the
 * same entry (and at the entry in the URL, when it has a `cid_eid` path).
 */
export function checkMetadataLinks(name: string) {
  cy.get(`[data-entryscape='${name}'] a[href*='/merged-metadata/']`, {
    timeout: 15000,
  }).then(($links) => {
    const hrefs = $links.toArray().map((a) => a.getAttribute("href") as string);
    // Not URLSearchParams: it decodes the "+" in "rdf+xml" to a space
    const formats = hrefs.map((h) => h.match(/[?&]format=([^&]+)/)?.[1]);
    expect(formats).to.include.members([
      "application/rdf+xml",
      "text/turtle",
      "text/n-triples",
      "application/ld+json",
    ]);

    const entries = new Set(
      hrefs.map(
        (h) => h.match(/\/store\/([^/]+)\/merged-metadata\/(\d+)/)?.[0],
      ),
    );
    expect(Array.from(entries), "one entry").to.have.length(1);

    cy.location("pathname").then((pathname) => {
      const path = pathname.match(/\/([^/]+)_(\d+)$/);
      if (path) {
        expect(Array.from(entries)[0]).to.equal(
          `/store/${path[1]}/merged-metadata/${path[2]}`,
        );
      }
    });
  });
}
