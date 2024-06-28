import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // This will automatically prefix cy.visit() and cy.request() commands with this baseUrl.
    baseUrl: "http://localhost:3000",
  },
});
