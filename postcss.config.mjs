/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // 👈 v3 설정을 읽어주는 친구
    autoprefixer: {}, // 👈 브라우저 호환성 맞춰주는 친구
  },
};

export default config;
