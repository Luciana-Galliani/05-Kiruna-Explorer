import API from "./client/src/API/API.mjs";
import { defineConfig } from "cypress";
const port = 3001;

/* const checkOrRegisterAndLogin = async ({ username, password }) => {
  try {
      const users = await API.getUsers();
      const userExists = users.some((user) => user.username === username); 

      if (userExists) {
          // Log in
          await API.loginUser({ username, password });
      } else {
          // Register the user and log in
          await API.registerUser({ username, password });
      }
      return { success: true };
  } catch (error) {
      console.error("Error in checkOrRegisterAndLogin:", error);
      throw error;
  }
}; */

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${port}`, // Server URL
    //viewportWidth: 1280,
    //viewportHeight: 720,
    //video: true,                      // Enable video recording
    //screenshotOnRunFailure: true,     // Take screenshots on test failures
    setupNodeEvents(on, config) {
      // implement node event listeners here
     /* on("task", {
        checkOrRegisterAndLogin({ username, password }) {
          return checkOrRegisterAndLogin({ username, password });
        },
      }); */
    },
  },
});