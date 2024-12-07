import { defineConfig } from "cypress";
const port = 3001;

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${port}`, // Server URL
    //viewportWidth: 1280,
    //viewportHeight: 720,
    //video: true,                      // Enable video recording
    //screenshotOnRunFailure: true,     // Take screenshots on test failures
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});