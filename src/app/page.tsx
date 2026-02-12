'use client'

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

// 🛠️ 1. 특수문자 디코딩 함수
function decodeHtmlEntity(str: string) {
  if (!str) return "";
  return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#8217;/g, "'")
            .replace(/&#8216;/g, "'");
}

// 🛠️ 2. 이미지 URL 추출 헬퍼 함수
function getFeaturedImage(post: any) {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

// 🛠️ 3. 데이터 가져오기
async function getPostData(id: string) {
  const res = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return null;
  const post = await res.json();

  const listRes = await fetch(
    `https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id`, 
    { cache: 'no-store' }
  );
  
  if (!listRes.ok) return { post, prevPost: null, nextPost: null };
  
  const allPosts = await listRes.json();
  const currentIndex = allPosts.findIndex((p: any) => p.id === parseInt(id));
  const prevId = currentIndex !== -1 ? allPosts[currentIndex + 1]?.id : null;
  const nextId = currentIndex !== -1 ? allPosts[currentIndex - 1]?.id : null;

  const [prevPost, nextPost] = await Promise.all([
    prevId ? fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${prevId}?_embed`).then(r => r.ok ? r.json() : null) : null,
    nextId ? fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${nextId}?_embed`).then(r => r.ok ? r.json() : null) : null
  ]);

  return { post, prevPost, nextPost };
}

// 🛠️ 4. 메인 페이지 컴포넌트
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    getPostData(id).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!data?.post) return;
    // 복사 버튼 스크립트 (기존 유지)
    const buttons = document.querySelectorAll('button[onclick*="clipboard"]');
    buttons.forEach((btn) => {
      btn.removeAttribute('onclick');
      const handleCopy = () => {
        const preElement = btn.previousElementSibling as HTMLPreElement;
        const codeElement = preElement?.querySelector('code');
        const textToCopy = codeElement?.innerText || preElement?.innerText || '';
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
      };
      btn.addEventListener('click', handleCopy);
    });
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.post) return notFound();

  const { post, prevPost, nextPost } = data;
  const featuredImage = getFeaturedImage(post);

  return (
    <main className="min-h-screen relative overflow-hidden pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          ← 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 mb-16">
          <div className="p-6 md:p-12 pb-0">
            <header className="mb-10 text-center">
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight break-keep" 
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <time className="text-slate-400 text-sm">
                {new Date(post.date).toLocaleDateString()}
                </time>
            </header>

            {featuredImage && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md mb-10 border border-stone-200">
                <Image src={featuredImage} alt="Featured" fill className="object-cover" priority />
                </div>
            )}

            {/* 🔥 본문 영역: 클래스 대청소 (충돌 방지) */}
            <div className="wordpress-wrapper">
              <div
                className="prose prose-slate max-w-none md:prose-lg break-words"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </div>

          {/* 하단 내비게이션 (기존 유지) */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-stone-100 mt-12">
            {prevPost ? (
              <Link href={`/tool/${prevPost.id}`} className="group relative h-40 md:h-48 block w-full border-r border-stone-100">
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Previous</span>
                    <span className="text-slate-800 font-bold leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: prevPost.title.rendered }} />
                </div>
              </Link>
            ) : <div className="h-40 md:h-48 bg-slate-50" />}

            {nextPost ? (
              <Link href={`/tool/${nextPost.id}`} className="group relative h-40 md:h-48 block w-full">
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Next</span>
                    <span className="text-slate-800 font-bold leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: nextPost.title.rendered }} />
                </div>
              </Link>
            ) : <div className="h-40 md:h-48 bg-slate-50" />}
          </div>
        </article>
      </div>
    </main>
  );
}
