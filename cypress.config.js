const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  env: {
    baseURL: process.env.BASE_URL,
  },
  e2e: {
    experimentalOrigin: true,
    setupNodeEvents(on, config) {},
  },
});
