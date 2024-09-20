import globals from "globals";
import pluginJs from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress/flat";

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "cypress/no-assigning-return-values": "error",
      "cypress/no-unnecessary-waiting": "error",
      "cypress/assertion-before-screenshot": "warn",
      // "cypress/no-force": "warn",
      // "cypress/no-async-tests": "error",
      // "cypress/no-async-before": "error",
      // "cypress/no-pause": "error",
      // "cypress/no-debug": "error",
    },

    plugins: {
      cypress: pluginCypress,
    },
  },
  pluginJs.configs.recommended,
  pluginCypress.configs.recommended,
];
