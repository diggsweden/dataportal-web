import { defineConfig } from "cypress";
import { verifyDownloadTasks } from "cy-verify-downloads";
import { rm } from "fs";

export default defineConfig({
  e2e: {
    // This will automatically prefix cy.visit() and cy.request() commands with this baseUrl.
    baseUrl: "http://localhost:3000",
    hideXHRInCommandLog: true,
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
