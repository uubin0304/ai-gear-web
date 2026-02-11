import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. 워드프레스 이미지 (메인)
      {
        protocol: "https",
        hostname: "credivita.com",
      },
      // 2. www 붙은 주소 대비
      {
        protocol: "https",
        hostname: "www.credivita.com",
      },
    ],
  },
};

export default nextConfig;
