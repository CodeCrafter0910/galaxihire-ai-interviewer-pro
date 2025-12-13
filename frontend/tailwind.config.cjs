/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        glassBg: "rgba(255,255,255,0.6)",
        glassDark: "rgba(10, 12, 16, 0.36)"
      },
      backdropBlur: {
        xs: "2px",
        sm: "6px",
      },
      boxShadow: {
        "glass-1": "0 6px 30px rgba(16, 24, 40, 0.12)",
        "glass-2": "inset 0 1px 0 rgba(255,255,255,0.08)"
      }
    }
  },
  plugins: [],
};
