import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// 🛠️ 1. 특수문자 디코딩 함수
function decodeHtmlEntity(str: string) {
  if (!str) return "";
  return str.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec))
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

// 🛠️ 3. 데이터 가져오기 (서버 사이드 실행)
async function getPostData(id: string) {
  try {
    // 기본 데이터 가져오기
    const res = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, {
      cache: 'no-store' // 항상 최신 데이터
    });
    
    if (!res.ok) return null;
    let post = await res.json();

    // 스타일 복구 로직 (인라인 스타일이 없으면 검색으로 다시 찾기)
    const hasInlineStyles = post.content.rendered.includes('style="') || post.content.rendered.includes("style='");
    
    if (!hasInlineStyles) {
      try {
        const cleanTitle = decodeHtmlEntity(post.title.rendered).replace(/<[^>]*>?/gm, '');
        const searchUrl = `https://credivita.com/ai/wp-json/wp/v2/posts?search=${encodeURIComponent(cleanTitle)}&_embed`;
        
        const searchRes = await fetch(searchUrl, { cache: 'no-store' });
        if (searchRes.ok) {
          const searchResults = await searchRes.json();
          const betterPost = searchResults.find((p: any) => p.id === post.id);
          if (betterPost && betterPost.content.rendered.includes('style="')) {
             post = betterPost;
          }
        }
      } catch (e) {
        console.warn("Fallback recovery failed:", e);
      }
    }

    // 이전/다음 글 가져오기
    const listRes = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id`, 
      { cache: 'no-store' }
    );
    
    let prevPost = null;
    let nextPost = null;

    if (listRes.ok) {
      const allPosts = await listRes.json();
      const currentIndex = allPosts.findIndex((p: any) => p.id === parseInt(id));
      
      const prevId = currentIndex !== -1 ? allPosts[currentIndex + 1]?.id : null;
      const nextId = currentIndex !== -1 ? allPosts[currentIndex - 1]?.id : null;

      [prevPost, nextPost] = await Promise.all([
        prevId ? fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${prevId}?_embed`).then(r => r.ok ? r.json() : null) : null,
        nextId ? fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${nextId}?_embed`).then(r => r.ok ? r.json() : null) : null
      ]);
    }

    return { post, prevPost, nextPost };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// 🛠️ 4. 메인 페이지 (서버 컴포넌트)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next.js 15+ 방식
  const data = await getPostData(id);

  if (!data || !data.post) return notFound();

  const { post, prevPost, nextPost } = data;
  const featuredImage = getFeaturedImage(post);

  return (
    <main className="min-h-screen relative overflow-hidden pb-20 bg-slate-50">
      
      {/* 배경 블러 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

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

            {/* 본문 영역 */}
            <div className="wordpress-wrapper">
              <div
                className="prose prose-slate max-w-none md:prose-lg break-words"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </div>

          {/* 하단 내비게이션 */}
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
