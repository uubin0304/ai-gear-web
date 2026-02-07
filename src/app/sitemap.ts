import { MetadataRoute } from 'next';

const BASE_URL = 'https://ai-tools.credivita.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 워드프레스에서 모든 글 가져오기 (최대 100개 예시)
  const res = await fetch('https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id,modified');
  const posts = await res.json();

  // 2. 블로그 글 URL 만들기
  const postUrls = posts.map((post: any) => ({
    url: `${BASE_URL}/tool/${post.id}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. 고정 페이지(메인)와 합치기
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ];
}
