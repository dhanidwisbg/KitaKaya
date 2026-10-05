import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf9fe",
        primary: {
          DEFAULT: "#030304",
          container: "#1d1d1f",
          fixed: "#e4e2e4",
        },
        secondary: {
          DEFAULT: "#005ab7",
          container: "#0372e4",
          fixed: "#d7e2ff",
        },
        tertiary: {
          DEFAULT: "#000400",
          container: "#e8f8ed",
          "on-container": "#009a3b",
        },
        surface: {
          DEFAULT: "#faf9fe",
          dim: "#dad9df",
          bright: "#faf9fe",
          "container-lowest": "#ffffff",
          "container-low": "#f4f3f8",
          container: "#eeedf3",
          "container-high": "#e9e7ed",
          "container-highest": "#e3e2e7",
        },
        "on-surface": "#1a1b1f",
        "on-surface-variant": "#46464a",
        outline: "#77767b",
        "outline-variant": "#c7c6ca",
        "apple-white": "#faf9fe",
        "apple-primary": "#030304",
        "apple-secondary": "#77767b",
        "apple-subtle": "#e9e7ed",
        "apple-surface": "#f4f3f8",
        "apple-blue": "#005ab7",
        "apple-green": "#009a3b",
        "apple-red": "#ba1a1a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        headline: ["var(--font-plus-jakarta)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "apple-card": "0 4px 20px rgba(0, 0, 0, 0.03)",
        "apple-float": "0 8px 32px rgba(0, 0, 0, 0.05)",
        "apple-pill": "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
