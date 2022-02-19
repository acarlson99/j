let DEBUG_MODE = true;

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-empty": ["warn"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { vars: "local", args: "all" },
    ],

    "linebreak-style": ["error", "unix"],
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    semi: ["error", "always"],
    "space-infix-ops": ["error", { int32Hint: false }],
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
          consistent: true,
        },
        ObjectPattern: "never",
        ImportDeclaration: "never",
      },
    ],
    "object-property-newline": [
      "error",
      { allowAllPropertiesOnSameLine: true },
    ],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "eol-last": ["error", "always"],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 2,
        maxEOF: 1,
      },
    ],
    "no-trailing-spaces": ["error", { ignoreComments: true }],
    "brace-style": "error",
    curly: "error",
    "comma-spacing": ["error", { before: false, after: true }],

    // DEBUG STUFF.  REMOVE LATER
    "@typescript-eslint/no-explicit-any": "off",
    // "@typescript-eslint/no-unused-vars": "off",
  },
};
