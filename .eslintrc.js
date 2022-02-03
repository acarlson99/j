module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 2],
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
    "react/prop-types": 0,
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
        ExportDeclaration: "always",
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
    "jsx-quotes": ["error", "prefer-double"],
    "react/jsx-closing-bracket-location": ["error", "line-aligned"],
    "react/jsx-curly-brace-presence": ["error", "never"],
    "react/jsx-no-duplicate-props": ["error", { ignoreCase: true }],
    "react/jsx-max-props-per-line": [
      "error",
      {
        maximum: 3,
        when: "always",
      },
    ],
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "brace-style": "error",
    curly: "error",
  },
};
