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
export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostData(params.id).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [params.id]);

  // 🔥 복사 버튼 활성화
  useEffect(() => {
    if (!data?.post) return;

    const buttons = document.querySelectorAll('button[onclick*="clipboard"]');
    
    buttons.forEach((btn) => {
      btn.removeAttribute('onclick');
      
      const handleCopy = () => {
        // pre 태그 찾기
        const preElement = btn.previousElementSibling as HTMLPreElement;
        const codeElement = preElement?.querySelector('code');
        const textToCopy = codeElement?.innerText || preElement?.innerText || '';
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = '✅ 복사 완료!';
          btn.classList.add('bg-green-500');
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-500');
            btn.classList.add('bg-blue-500');
          }, 2000);
        }).catch(err => {
          console.error('복사 실패:', err);
          btn.textContent = '❌ 복사 실패';
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

            {/* 🔥 본문 영역 */}
            <div className="wordpress-wrapper">
              <div
                className="
                  prose prose-lg max-w-none 
                  break-words mb-12
                  
                  prose-p:text-base prose-p:leading-relaxed prose-p:my-4 prose-p:text-slate-700
                  
                  prose-headings:font-bold prose-headings:break-keep prose-headings:text-slate-900
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  
                  prose-a:text-orange-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-orange-700 hover:prose-a:underline
                  
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:w-full
                  
                  prose-ul:my-6 prose-ul:pl-6
                  prose-ol:my-6 prose-ol:pl-6
                  prose-li:my-2 prose-li:text-slate-700
                  
                  prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-6
                  
                  prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
                  prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  
                  prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-table:shadow-md
                  prose-thead:bg-blue-500
                  prose-th:text-white prose-th:font-bold prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-slate-300
                  prose-td:p-3 prose-td:border prose-td:border-slate-200 prose-td:text-slate-700
                  prose-tr:even:bg-slate-50
                  
                  md:prose-xl
                "
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </div>

          {/* 하단 내비게이션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-stone-100">
            {/* 이전글 */}
            {prevPost ? (
              <Link href={`/tool/${prevPost.id}`} className="group relative h-48 md:h-60 overflow-hidden block w-full">
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

            {/* 다음글 */}
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
