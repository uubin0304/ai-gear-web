import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const notoSerifKR = Noto_Serif_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif-kr" });

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-tools.credivita.com'), // 사이트 주소 명시
  title: {
    default: "AI Gear - 실전 압축 AI 툴 디렉토리",
    template: "%s | AI Gear",
  },
  description: "복잡한 AI, 쉽게 골라드립니다. 영상 편집부터 글쓰기까지, 검증된 툴만 모았습니다.",
  openGraph: {
    title: "AI Gear - 실전 압축 AI 툴 디렉토리",
    description: "복잡한 AI, 쉽게 골라드립니다. 영상 편집부터 글쓰기까지, 검증된 툴만 모았습니다.",
    url: "https://ai-tools.credivita.com",
    siteName: "AI Gear",
    images: [
      {
        url: "/og-image.png", // public 폴더에 넣은 이미지 이름
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css" rel="stylesheet" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7040793716815812"
          crossOrigin="anonymous"
        ></script>
      </head>
      <meta name="google-site-verification" content="OpG3PDf9LT1cuS6t6t5v07uXaYl2_CtV2o2VbLKnxiE" />
      <meta name="naver-site-verification" content="7bdda18d7419a1e28d120b1f033c0dc570147c60" />
      <body className={`${inter.variable} ${playfair.variable} ${notoSerifKR.variable} antialiased bg-slate-50 text-slate-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}
