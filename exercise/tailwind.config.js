/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline": "#849495",
        "surface-bright": "#2c3a4c",
        "primary-container": "#00f5ff",
        "secondary": "#c2c6d8",
        "tertiary-fixed": "#dce1fe",
        "on-primary-container": "#006c71",
        "inverse-surface": "#d4e4fa",
        "on-error": "#690005",
        "on-primary": "#003739",
        "surface-dim": "#051424",
        "on-secondary": "#2b303e",
        "surface-variant": "#273647",
        "on-primary-fixed": "#002021",
        "secondary-container": "#424655",
        "on-secondary-container": "#b0b5c6",
        "on-secondary-fixed": "#161b28",
        "inverse-primary": "#00696e",
        "tertiary-fixed-dim": "#c0c5e1",
        "outline-variant": "#3a494a",
        "surface": "#051424",
        "tertiary": "#fbf9ff",
        "error": "#ffb4ab",
        "on-surface": "#d4e4fa",
        "on-tertiary-fixed-variant": "#40465d",
        "primary-fixed": "#63f7ff",
        "on-secondary-fixed-variant": "#424655",
        "on-surface-variant": "#b9caca",
        "on-tertiary-fixed": "#141b2f",
        "secondary-fixed": "#dee2f4",
        "surface-container-highest": "#273647",
        "surface-container-low": "#0d1c2d",
        "primary": "#e9feff",
        "surface-tint": "#00dce5",
        "secondary-fixed-dim": "#c2c6d8",
        "inverse-on-surface": "#233143",
        "primary-fixed-dim": "#00dce5",
        "error-container": "#93000a",
        "on-background": "#d4e4fa",
        "surface-container-high": "#1c2b3c",
        "on-tertiary-container": "#5a6078",
        "surface-container-lowest": "#010f1f",
        "on-primary-fixed-variant": "#004f53",
        "tertiary-container": "#d7dcf8",
        "on-tertiary": "#2a3045",
        "surface-container": "#122131",
        "on-error-container": "#ffdad6",
        "background": "#051424"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        md: "20px",
        base: "8px",
        gutter: "16px",
        lg: "32px",
        sm: "12px",
        xs: "4px",
        xl: "48px",
        "container-margin": "16px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Oswald", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "data-tabular": ["JetBrains Mono", "monospace"],
        "label-caps": ["Inter", "sans-serif"],
        "headline-md": ["Oswald", "sans-serif"],
        "headline-lg": ["Oswald", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "data-tabular": ["16px", { lineHeight: "20px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }]
      }
    }
  },
  plugins: []
};
