/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // 👈 File HTML utama
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 Semua file React di folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
