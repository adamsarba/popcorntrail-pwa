/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
};

export default config;
