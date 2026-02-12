/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // 👈 v4 전용 플러그인 (이게 맞습니다!)
  },
};

export default config;
