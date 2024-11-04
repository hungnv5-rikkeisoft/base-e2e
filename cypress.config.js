const { defineConfig } = require("cypress");
const path = require("path");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");

const webpackPreprocessor = require("@cypress/webpack-preprocessor");
async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  const options = {
    webpackOptions: {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./cypress"),
          "@Pages": path.resolve(__dirname, "./cypress/e2e/Pages"),
          "@Test": path.resolve(__dirname, "./cypress/e2e/Tests"),
          "@fixtures": path.resolve(__dirname, "./cypress/fixtures"),
        },
      },
      module: {
        rules: [
          {
            test: /\.feature$/,
            use: [
              {
                loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                options: config,
              },
            ],
          },
        ],
      },
    },
  };

  on("file:preprocessor", webpackPreprocessor(options));

  return config;
}

module.exports = defineConfig({
  projectId: "9o64v4",
  env: {
    baseURL: process.env.BASE_URL,
  },
  e2e: {
    specPattern: ["**/*.feature", "**/*.cy.js"],
    // supportFile: false,
    setupNodeEvents,
    chromeWebSecurity: false,
  },

  component: {
    devServer: {
      framework: "nuxt",
      bundler: "webpack",
    },
  },
});
