import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
  // (1) 현재 글 가져오기
  const res = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const post = await res.json();

  // (2) 전체 글 ID 목록 가져오기 (가볍게)
  const listRes = await fetch(
    `https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id`, 
    { next: { revalidate: 60 } }
  );
  
  // 목록 가져오기 실패 시 현재 글만 반환
  if (!listRes.ok) return { post, prevPost: null, nextPost: null };
  
  const allPosts = await listRes.json();
  
  // (3) 현재 글 위치 찾기
  const currentIndex = allPosts.findIndex((p: any) => p.id === parseInt(id));
  
  // (4) 이전글/다음글 ID 추출
  const prevId = currentIndex !== -1 ? allPosts[currentIndex + 1]?.id : null;
  const nextId = currentIndex !== -1 ? allPosts[currentIndex - 1]?.id : null;

  // (5) 이전글/다음글 상세 정보 병렬로 가져오기
  const [prevPost, nextPost] = await Promise.all([
    prevId ? fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${prevId}?_embed`).then(r => r.ok ? r.json() : null) : null,
    nextId ? fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${nextId}?_embed`).then(r => r.ok ? r.json() : null) : null
  ]);

  return { post, prevPost, nextPost };
}

// 🛠️ 4. 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getPostData(id);
  if (!data || !data.post) return { title: "페이지를 찾을 수 없음" };

  const title = decodeHtmlEntity(data.post.title.rendered);
  const ogImage = getFeaturedImage(data.post);

  return {
    title: `${title} | Credivita AI`,
    openGraph: {
      title: title,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

// 🛠️ 5. 메인 페이지 컴포넌트
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPostData(id);

  if (!data || !data.post) return notFound();

  const { post, prevPost, nextPost } = data;
  const featuredImage = getFeaturedImage(post);

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

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 mb-16">
          <div className="p-6 md:p-12 pb-0">
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
                    alt="Featured Image"
                    fill
                    className="object-cover"
                    priority
                />
                </div>
            )}

            {/* 👇 여기가 핵심! 모바일 가독성 최적화된 본문 영역 */}
            <div
                className="
                    prose max-w-none text-slate-800 break-words mb-12
                    prose-p:text-[17px] prose-p:leading-[1.8] prose-p:my-6 prose-p:tracking-[-0.3px]
                    prose-headings:font-bold prose-headings:break-keep
                    prose-h2:text-[22px] prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-[19px] prose-h3:mt-8
                    prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-800
                    prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                    md:prose-p:text-[18px] md:prose-p:leading-loose
                "
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>

          {/* 👇 하단 내비게이션 (이전글/다음글) */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-stone-100">
            
            {/* 1. 이전 글 카드 */}
            {prevPost ? (
              <Link href={`/tool/${prevPost.id}`} className="group relative h-48 md:h-60 overflow-hidden block w-full">
                {/* 배경 이미지 */}
                {getFeaturedImage(prevPost) ? (
                   <Image 
                     src={getFeaturedImage(prevPost)} 
                     alt="이전 글" 
                     fill 
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                ) : (
                   <div className="w-full h-full bg-slate-800" /> 
                )}
                
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300"></div>

                <div className="absolute top-0 left-0 bg-slate-800/80 text-white text-xs px-4 py-2 font-bold backdrop-blur-sm">
                  이전글
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <span className="text-white font-bold text-xl md:text-2xl leading-tight drop-shadow-md group-hover:text-orange-200 transition-colors"
                          dangerouslySetInnerHTML={{ __html: prevPost.title.rendered }}
                    />
                </div>
              </Link>
            ) : (
                <div className="hidden md:block bg-slate-50 h-48 md:h-60 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium">
                        첫 번째 글입니다
                    </div>
                </div>
            )}

            {/* 2. 다음 글 카드 */}
            {nextPost ? (
              <Link href={`/tool/${nextPost.id}`} className="group relative h-48 md:h-60 overflow-hidden block w-full border-l border-white/10">
                {getFeaturedImage(nextPost) ? (
                   <Image 
                     src={getFeaturedImage(nextPost)} 
                     alt="다음 글" 
                     fill 
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                ) : (
                   <div className="w-full h-full bg-slate-800" />
                )}

                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300"></div>

                <div className="absolute top-0 right-0 bg-slate-800/80 text-white text-xs px-4 py-2 font-bold backdrop-blur-sm">
                  다음글
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <span className="text-white font-bold text-xl md:text-2xl leading-tight drop-shadow-md group-hover:text-orange-200 transition-colors"
                          dangerouslySetInnerHTML={{ __html: nextPost.title.rendered }}
                    />
                </div>
              </Link>
            ) : (
                <div className="hidden md:block bg-slate-50 h-48 md:h-60 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium">
                        마지막 글입니다
                    </div>
                </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
