import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. 기존 Unsplash 이미지 (테스트용 유지)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // 2. 워드프레스 이미지 (메인)
      {
        protocol: "https",
        hostname: "credivita.com",
      },
      // 3. www 붙은 주소 대비
      {
        protocol: "https",
        hostname: "www.credivita.com",
      },
    ],
  },
};

export default nextConfig;
