// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
if (Cypress.config("hideXHRInCommandLog")) {
  const app = window.top;

  if (
    app &&
    !app.document.head.querySelector("[data-hide-command-log-request]")
  ) {
    const style = app.document.createElement("style");
    style.innerHTML =
      ".command-name-request, .command-name-xhr { display: none }";
    style.setAttribute("data-hide-command-log-request", "");

    app.document.head.appendChild(style);
  }
}

// This is set to make sure that the cookie settings are set to accepted before each test
beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem(
      "digg-store",
      JSON.stringify({
        cookieSettings: {
          analytic: {
            label: "Analytiska kakor",
            description:
              "Ger oss information om hur vår webbplats används som gör att vi kan underhålla, driva och förbättra användarupplevelsen.",
            accepted: true,
          },
        },
      }),
    );
  });
});
