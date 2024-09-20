const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "9o64v4",
  env: {
    baseURL: process.env.BASE_URL,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
  },

  component: {
    devServer: {
      framework: "nuxt",
      bundler: "webpack",
    },
  },
});
