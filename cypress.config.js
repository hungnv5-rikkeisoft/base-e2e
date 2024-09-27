const { defineConfig } = require("cypress");
const path = require("path");

const webpackPreprocessor = require("@cypress/webpack-preprocessor");
const wpOptions = {
  webpackOptions: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./cypress"),
        "@fixtures": path.resolve(__dirname, "./cypress/fixtures"),
      },
    },
  },
  watchOptions: {},
};
module.exports = defineConfig({
  projectId: "9o64v4",
  env: {
    baseURL: process.env.BASE_URL,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("file:preprocessor", webpackPreprocessor(wpOptions));
    },
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
  },

  component: {
    devServer: {
      framework: "nuxt",
      bundler: "webpack",
    },
  },
});
