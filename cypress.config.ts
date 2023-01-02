import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://demoqa.com/alerts",
    viewportHeight: 1080,
    viewportWidth: 1920,
    pageLoadTimeout: 80000,
    defaultCommandTimeout: 10000,
    video: false,
    retries: 0,
    scrollBehavior: "center",
    chromeWebSecurity: false,
    watchForFileChanges: true,
    experimentalSessionAndOrigin: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    numTestsKeptInMemory: 0,
  },
});
