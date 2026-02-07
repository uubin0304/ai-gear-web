import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // 숨길 경로가 있다면 추가
    },
    sitemap: 'https://ai-tools.credivita.com/sitemap.xml',
  };
}
