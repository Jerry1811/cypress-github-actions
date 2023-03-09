import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://qas-eastus-hrvyst-app.azurewebsites.net",
    viewportHeight: 720,
    viewportWidth: 1024,
    pageLoadTimeout: 2000000,
    defaultCommandTimeout: 2000000,
    requestTimeout: 2000000,
    responseTimeout: 2000000,
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
