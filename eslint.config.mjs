import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "public/**",
      "**/*.config.*",
      "eslint.config.mjs",
    ],
  },
];

export default eslintConfig;
