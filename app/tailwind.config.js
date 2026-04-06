/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jet':    '#2D3142',   // primary background
        'slate':  '#4F5D75',   // cards, secondary surfaces
        'silver': '#BFC0C0',   // body text, muted labels
        'white':  '#FFFFFF',   // headings, primary text
        'coral':  '#EF8354',   // accent, CTA, active states
      },
    },
  },
  plugins: [],
}
