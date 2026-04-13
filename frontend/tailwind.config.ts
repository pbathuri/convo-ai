import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-light": "var(--bg-light)",
        "bg-light-secondary": "var(--bg-light-secondary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "bg-dark": "var(--bg-dark)",
        "bg-dark-card": "var(--bg-dark-card)",
        "bg-dark-hover": "var(--bg-dark-hover)",
        "text-dark-primary": "var(--text-dark-primary)",
        "text-dark-secondary": "var(--text-dark-secondary)",
        brand: {
          green: "var(--brand-green)",
          "green-hover": "var(--brand-green-hover)",
          "green-light": "var(--brand-green-light)",
          blue: "var(--brand-blue)",
          orange: "var(--brand-orange)",
          red: "var(--brand-red)",
          purple: "var(--brand-purple)",
          gold: "var(--brand-gold)",
        },
        "border-light": "var(--border-light)",
        "border-dark": "var(--border-dark)",
        "border-active": "var(--border-active)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "12px",
        "btn-sm": "8px",
        input: "8px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.1)",
        "card-dark": "0 2px 8px rgba(0,0,0,0.3)",
      },
      transitionDuration: {
        page: "300ms",
        btn: "150ms",
        progress: "600ms",
      },
    },
  },
  plugins: [],
};

export default config;
