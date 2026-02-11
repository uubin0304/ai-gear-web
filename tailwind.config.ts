import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // 애니메이션 설정 유지
      animation: {
        float: "float 3s ease-in-out infinite",
        blob: "blob 7s infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      // 👇 여기가 핵심입니다! (타이포그래피 커스텀)
      typography: {
        DEFAULT: {
          css: {
            "h1, h2, h3, h4": {
              "word-break": "keep-all", // 제목 줄바꿈 방지
              "font-weight": "800",
            },
            p: {
              "word-break": "keep-all", // 본문 단어 단위 줄바꿈 (가독성 UP)
            },
            // 모바일 기본 설정 (폰트 크기 17px, 줄간격 1.75배)
            fontSize: "17px",
            lineHeight: "1.75",
            color: "#334155", // slate-700
            a: {
              color: "#ea580c", // orange-600
              "&:hover": {
                color: "#9a3412", // orange-800
              },
            },
          },
        },
        // 화면이 클 때(md 이상) 설정 (폰트 18px로 더 시원하게)
        md: {
          css: {
            fontSize: "18px",
            lineHeight: "1.8",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
