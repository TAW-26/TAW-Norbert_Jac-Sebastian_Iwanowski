/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // <--- TA LINIJKA BLOKUJE SYSTEMOWY MOTYW
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}