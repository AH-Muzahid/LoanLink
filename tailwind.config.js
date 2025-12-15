/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        idlc: {
          primary: "#E31E24",   // Main Red
          secondary: "#B91116", // Dark Red
          accent: "#FDB913",    // Yellow/Gold
          text: "#333333",      // Main Text
          bg: "#F3F4F6",        // Light Background
        }
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        loanlink: {
          "primary": "#E31E24",
          "secondary": "#FDB913",
          "accent": "#B91116",
          "neutral": "#333333",
          "base-100": "#ffffff",
          "base-200": "#F3F4F6",
          "base-300": "#e5e7eb",
        },
      },
      "dark",
    ],
  },
}
