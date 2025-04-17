import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}"],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          '"Instrument Serif"',
          "serif",
          ...defaultTheme.fontFamily.serif,
        ],

        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "light-gray": "#f9fafb", // Example matching gray-50
        "dark-blue": "#1e293b", // Darkened from #1e293b (slate-700) to slate-800
        "bg-light": "#f9fafb", // ~ gray-50 or gray-100
      },
      boxShadow: {
        // Neumorphic style for light elements on a light background
        "neumorphic-light":
          "-4px -4px 8px rgba(255, 255, 255, 0.8), 4px 4px 8px rgba(0, 0, 0, 0.15)",
        // A slightly softer shadow for the dark button (optional, could also use shadow-lg)
        "neumorphic-dark":
          "-4px -4px 8px rgba(255, 255, 255, 0.05), 4px 4px 8px rgba(0, 0, 0, 0.3)",
        // Optional: Inner shadow for pressed state
        "neumorphic-light-inset":
          "inset -4px -4px 8px rgba(255, 255, 255, 0.8), inset 4px 4px 8px rgba(0, 0, 0, 0.15)",
        // New: Shadow for the dark button on a light background
        "neumorphic-dark-button":
          "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.15)",
        // New: Inset shadow for the dark button's active state
        "neumorphic-dark-button-inset": "none",
      },
    },
  },
  plugins: [],
};
