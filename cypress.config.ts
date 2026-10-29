import { rm } from "node:fs";
import { verifyDownloadTasks } from "cy-verify-downloads";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // This will automatically prefix cy.visit() and cy.request() commands with this baseUrl.
    baseUrl: "http://localhost:3000",
    hideXHRInCommandLog: true,
    env: {
      // Same app, but a `sandbox` host makes it use the sandbox entrystore.
      sandboxUrl: "http://sandbox.localhost:3000",
    },
    setupNodeEvents(on) {
      on("task", verifyDownloadTasks);
      on("task", {
        deleteFolder(folderName) {
          return new Promise((resolve) => {
            rm(folderName, { maxRetries: 10, recursive: true }, (err) => {
              if (err) {
                console.error(err);
              }
              resolve(null);
            });
          });
        },
      });
    },
  },
});
