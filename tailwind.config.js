/** @type {import('tailwindcss').Config} */
module.exports = {
    // NativeWind v4가 스타일을 스캔할 경로 설정
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
    },
    plugins: [],
};