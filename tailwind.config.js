import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Geist Sans",
        "-apple-system",
        "system-ui",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
    },
    extend: {
      colors: {
        accent: "#f70000",
        red: "#ff453a",
        green: "#63da38",
        blue: "#0b84ff",
        orange: "#ff9e0b",
      },
    },
    container: {
      center: true,
      screens: {
        sm: "64rem",
        md: "64rem",
        lg: "64rem",
        xl: "64rem",
        "2xl": "64rem",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("child", "& > *");
    }),
    "prettier-plugin-tailwindcss",
  ],
};
