import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const notoSerifKR = Noto_Serif_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif-kr" });

export const metadata: Metadata = {
  title: {
    default: "AI Gear - 실전 압축 AI 툴 디렉토리",
    template: "%s | AI Gear",
  },
  description: "복잡한 AI, 쉽게 골라드립니다. 영상 편집부터 글쓰기까지, 검증된 AI 도구 모음.",
  openGraph: {
    title: "AI Gear - 실전 압축 AI 툴 디렉토리",
    description: "복잡한 AI, 쉽게 골라드립니다. 영상 편집부터 글쓰기까지, 검증된 AI 도구 모음.",
    siteName: "AI Gear",
    locale: "ko_KR",
    type: "website",
    url: "https://ai-gear.vercel.app", // Fallback URL
    images: [
      {
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200", // Using FeaturedPost image as OG image
        width: 1200,
        height: 630,
        alt: "AI Gear Featured Image",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
