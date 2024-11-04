import globals from "globals";
import pluginJs from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress/flat";

export default [
  {
    languageOptions: { globals: globals.browser },

    plugins: {
      cypress: pluginCypress,
    },
  },
  pluginJs.configs.recommended,
  pluginCypress.configs.recommended,
  {
    rules: {
      "cypress/no-assigning-return-values": "error",
      "cypress/assertion-before-screenshot": "warn",
      // "cypress/no-force": "warn",
      // "cypress/no-async-tests": "error",
      // "cypress/no-async-before": "error",
      // "cypress/no-pause": "error",
      // "cypress/no-debug": "error",
      "cypress/unsafe-to-chain-command": "off",
      "cypress/no-unnecessary-waiting": "off",
    },
  },
  {
    ignores: ["cypress.config.js", "package.json"],
  },
];
