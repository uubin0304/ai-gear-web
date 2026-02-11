import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 🛠️ 1. 특수문자 깨짐 방지 함수
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

// 🛠️ 2. [핵심] 워드프레스 똥(?) 스타일 제거 함수 (세탁기)
// 이 함수가 없으면 모바일에서 글씨가 절대 안 커집니다.
function cleanContentStyles(content: string) {
  if (!content) return "";
  return content
    // 워드프레스가 강제로 박아놓은 폰트 크기, 줄간격, 너비 제한을 삭제합니다.
    .replace(/style="[^"]*"/g, "") 
    .replace(/width="[^"]*"/g, "")
    .replace(/height="[^"]*"/g, "");
}

// 🛠️ 3. 이미지 URL 추출 함수
function getFeaturedImage(post: any) {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

// 🛠️ 4. 데이터 가져오기 (이전글/다음글 포함)
async function getPostData(id: string) {
  const res = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const post = await res.json();

  const listRes = await fetch(
    `https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id,title`, 
    { next: { revalidate: 60 } }
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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPostData(id);

  if (!data || !data.post) return notFound();

  const { post, prevPost, nextPost } = data;
  const featuredImage = getFeaturedImage(post);

  // 🧼 여기서 스타일 세탁기를 돌립니다!
  const cleanBodyContent = cleanContentStyles(post.content.rendered);

  return (
    <main className="min-h-screen relative overflow-hidden pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 pt-12">
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
                <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg mb-12 border border-stone-200">
                <Image
                    src={featuredImage} 
                    alt="Featured Image"
                    fill
                    className="object-cover"
                    priority
                />
                </div>
            )}

            {/* 👇 여기가 핵심! 디자인 강제 적용 구역 */}
            <div
                className="
                    /* 1. 기본 레이아웃 */
                    prose max-w-none text-slate-800 break-words mb-16
                    
                    /* 📱 2. 모바일 가독성 (여기 숫자를 바꾸면 모바일 폰트가 바뀝니다) */
                    prose-p:text-[18px]        /* 본문 크기 18px (시원하게) */
                    prose-p:leading-[1.85]     /* 줄간격 1.85배 (널널하게) */
                    prose-p:tracking-[-0.03em] /* 자간 좁힘 (깔끔하게) */
                    prose-p:mb-6               /* 문단 간격 */
                    
                    /* 🖥️ 3. PC 가독성 */
                    md:prose-p:text-[19px] 
                    md:prose-p:leading-[2.0]

                    /* 🎨 4. 소제목 (H2) 디자인: 주황색 밑줄 */
                    prose-h2:text-[24px] md:prose-h2:text-[28px]
                    prose-h2:font-extrabold prose-h2:text-slate-900
                    prose-h2:mt-14 prose-h2:mb-6
                    prose-h2:border-b-[4px] prose-h2:border-orange-200 prose-h2:pb-2
                    prose-h2:inline-block prose-h2:w-full

                    /* 🎨 5. 소제목 (H3) 디자인: 왼쪽 주황색 바 */
                    prose-h3:text-[21px] md:prose-h3:text-[24px]
                    prose-h3:font-bold prose-h3:text-slate-800
                    prose-h3:mt-10 prose-h3:mb-4
                    prose-h3:border-l-[6px] prose-h3:border-orange-500 prose-h3:pl-4
                    
                    /* 6. 기타 요소 (링크, 리스트) */
                    prose-a:text-orange-600 prose-a:font-bold prose-a:no-underline hover:prose-a:text-orange-800 hover:prose-a:bg-orange-50
                    prose-li:text-[17px] prose-li:leading-relaxed prose-li:my-2
                    prose-strong:text-orange-700 prose-strong:font-black
                    prose-img:rounded-2xl prose-img:shadow-md
                "
                // 🧼 세탁된 내용을 넣습니다
                dangerouslySetInnerHTML={{ __html: cleanBodyContent }}
            />
          </div>

          {/* 하단 내비게이션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-stone-100">
            {prevPost ? (
              <Link href={`/tool/${prevPost.id}`} className="group relative h-32 md:h-48 overflow-hidden block w-full bg-slate-900">
                <div className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity">
                    {getFeaturedImage(prevPost) && <Image src={getFeaturedImage(prevPost)} alt="" fill className="object-cover" />}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">이전 글</span>
                    <span className="text-white font-bold text-lg md:text-xl line-clamp-2" dangerouslySetInnerHTML={{ __html: prevPost.title.rendered }} />
                </div>
              </Link>
            ) : <div className="h-32 md:h-48 bg-slate-50" />}

            {nextPost ? (
              <Link href={`/tool/${nextPost.id}`} className="group relative h-32 md:h-48 overflow-hidden block w-full bg-slate-900 border-l border-slate-700">
                 <div className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity">
                    {getFeaturedImage(nextPost) && <Image src={getFeaturedImage(nextPost)} alt="" fill className="object-cover" />}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">다음 글</span>
                    <span className="text-white font-bold text-lg md:text-xl line-clamp-2" dangerouslySetInnerHTML={{ __html: nextPost.title.rendered }} />
                </div>
              </Link>
            ) : <div className="h-32 md:h-48 bg-slate-50" />}
          </div>
        </article>
      </div>
    </main>
  );
}
