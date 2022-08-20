module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: { "@typescript-eslint/no-explicit-any": "off" },
  ignorePatterns: ["build", "coverage", ".eslintrc.js"],
  overrides: [
    {
      files: ["**/*.spec.ts", "**/*.e2e.ts"],
      plugins: ["jest"],
      rules: {
        "@typescript-eslint/unbound-method": "off",
        "jest/unbound-method": "error",
      },
    },
  ],
};
