import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://qas-eastus-hrvyst-app.azurewebsites.net",
    viewportHeight: 720,
    viewportWidth: 1024,
    // pageLoadTimeout: 100000,
    // defaultCommandTimeout: 80000,
    // requestTimeout: 80000,
    // responseTimeout: 80000,
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
