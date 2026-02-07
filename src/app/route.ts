import { NextResponse } from 'next/server';

const BASE_URL = 'https://ai-tools.credivita.com';
const WP_API = 'https://credivita.com/ai/wp-json/wp/v2/posts?_embed&per_page=20'; // 최신글 20개만

export async function GET() {
  try {
    // 1. 워드프레스에서 글 목록 가져오기
    const res = await fetch(WP_API, { next: { revalidate: 3600 } });
    const posts = await res.json();

    // 2. RSS XML 만들기 (링크를 우리 사이트 주소로 바꿔치기!)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>AI Gear - 실전 압축 AI 툴 디렉토리</title>
        <link>${BASE_URL}</link>
        <description>복잡한 AI, 쉽게 골라드립니다.</description>
        <language>ko</language>
        <atom:link href="${BASE_URL}/rss" rel="self" type="application/rss+xml" />
        ${posts.map((post: any) => `
          <item>
            <title><![CDATA[${post.title.rendered}]]></title>
            <link>${BASE_URL}/tool/${post.id}</link>
            <guid isPermaLink="true">${BASE_URL}/tool/${post.id}</guid>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <description><![CDATA[${post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 300)}...]]></description>
          </item>
        `).join('')}
      </channel>
    </rss>`;

    // 3. XML 형식으로 응답 보내기
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating RSS', { status: 500 });
  }
}
