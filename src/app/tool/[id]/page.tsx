import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 🛠️ 1. 특수문자 디코딩 함수 (제목 깨짐 방지)
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

// 🛠️ 2. 데이터 가져오기 (현재글 + 이전/다음글 찾기 로직 통합)
async function getPostData(id: string) {
  // (1) 현재 글 가져오기
  const res = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) return null;
  const post = await res.json();

  // (2) 이전/다음글 계산을 위해 가벼운 리스트 가져오기 (제목과 ID만)
  // per_page=100으로 최신 100개 글 내에서 탐색
  const listRes = await fetch(
    `https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id,title`, 
    { next: { revalidate: 60 } }
  );
  
  if (!listRes.ok) return { post, prevPost: null, nextPost: null };
  
  const allPosts = await listRes.json();
  
  // 현재 글의 위치(Index) 찾기
  // 주의: 워드프레스 API에서 ID는 숫자형이므로 parseInt 필요
  const currentIndex = allPosts.findIndex((p: any) => p.id === parseInt(id));
  
  // 워드프레스는 기본적으로 최신순 정렬이므로:
  // index + 1 = 더 오래된 글 (이전 글)
  // index - 1 = 더 최신 글 (다음 글)
  const prevPost = currentIndex !== -1 ? allPosts[currentIndex + 1] || null : null;
  const nextPost = currentIndex !== -1 ? allPosts[currentIndex - 1] || null : null;

  return { post, prevPost, nextPost };
}

// 🛠️ 3. 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getPostData(id);

  if (!data || !data.post) return { title: "페이지를 찾을 수 없음" };

  const title = decodeHtmlEntity(data.post.title.rendered);
  const description = data.post.excerpt?.rendered 
    ? data.post.excerpt.rendered.replace(/<[^>]*>?/gm, "").slice(0, 100) 
    : "AI 툴 상세 정보";
  
  const ogImage = data.post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    title: `${title} | Credivita AI`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

// 🛠️ 4. 메인 컴포넌트
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPostData(id);

  if (!data || !data.post) return notFound();

  const { post, prevPost, nextPost } = data;

  // 이미지 처리 (Unsplash 제거됨)
  const featuredImage = 
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

  const cleanTitle = decodeHtmlEntity(post.title.rendered);

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      
      {/* 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          ← 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-stone-100 mb-16">
          <header className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight break-keep" 
                dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <time className="text-slate-400 text-sm">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </header>

          {featuredImage && (
            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg mb-12 border border-stone-200">
              <Image
                src={featuredImage} 
                alt={cleanTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-800 prose-img:rounded-xl break-words"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* 👇 추가된 이전글/다음글 내비게이션 섹션 */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center">
            {prevPost ? (
              <Link href={`/tool/${prevPost.id}`} className="group flex-1 max-w-[45%] text-left">
                <span className="text-xs text-slate-400 block mb-1">← 이전 글</span>
                <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: prevPost.title.rendered }} 
                />
              </Link>
            ) : <div className="flex-1" />} {/* 빈 공간 채우기용 */}

            {nextPost ? (
              <Link href={`/tool/${nextPost.id}`} className="group flex-1 max-w-[45%] text-right pl-4">
                <span className="text-xs text-slate-400 block mb-1">다음 글 →</span>
                <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: nextPost.title.rendered }} 
                />
              </Link>
            ) : <div className="flex-1" />}
          </div>

        </article>
      </div>
    </main>
  );
}
