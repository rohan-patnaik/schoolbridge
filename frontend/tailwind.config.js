/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ColorHunt palette: #EAEFEF #BFC9D1 #25343F #FF9B51
        sage: {
          50: "#f4f7f7",
          100: "#EAEFEF",
          200: "#dce4e4",
          300: "#BFC9D1",
          400: "#a3b0b8",
          500: "#8a99a2",
        },
        navy: {
          DEFAULT: "#25343F",
          50: "#f0f3f5",
          100: "#d8e0e5",
          200: "#b0c0ca",
          300: "#7a95a4",
          400: "#4d6878",
          500: "#374d5a",
          600: "#25343F",
          700: "#1c2830",
          800: "#141d23",
          900: "#0d1317",
        },
        accent: {
          DEFAULT: "#FF9B51",
          50: "#fff7f0",
          100: "#fff0e0",
          200: "#ffddb8",
          300: "#ffc48a",
          400: "#FFAD6B",
          500: "#FF9B51",
          600: "#f08030",
          700: "#d96a1c",
          800: "#b55516",
          900: "#8a4012",
        },
        urgency: {
          low: "#22c55e",
          medium: "#f59e0b",
          high: "#ef4444",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(37, 52, 63, 0.06), 0 1px 2px -1px rgba(37, 52, 63, 0.06)",
        "card-hover": "0 4px 12px 0 rgba(37, 52, 63, 0.08), 0 2px 4px -2px rgba(37, 52, 63, 0.06)",
        soft: "0 2px 8px 0 rgba(37, 52, 63, 0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
