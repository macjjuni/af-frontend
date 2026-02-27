/** @type {import('tailwindcss').Config} */
module.exports = {
    // NativeWind v4가 스타일을 스캔할 경로 설정
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Pretendard-Regular'], // 기본 폰트
                pretendard: ['Pretendard-Regular'],
                'pretendard-medium': ['Pretendard-Medium'],
                'pretendard-bold': ['Pretendard-Bold'],
            },
        },
    },
    plugins: [],
};