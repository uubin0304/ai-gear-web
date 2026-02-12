import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 🛠️ 1. 특수문자 깨짐 방지
function decodeHtmlEntity(str: string) {
  if (!str) return "";
  return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
            .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'");
}

// 🛠️ 2. [강력한 세탁기] 디자인 방해 요소 강제 삭제
function cleanContentStyles(content: string) {
  if (!content) return "";
  return content
    // (1) H2, H3 태그에 붙은 인라인 스타일을 통째로 삭제합니다. (Tailwind 디자인 100% 적용)
    .replace(/(<h[23][^>]*)style="[^"]*"/gi, '$1')
    
    // (2) 폰트, 줄간격 등 기본 스타일 삭제
    .replace(/font-family:[^;"]+;?/g, "")
    .replace(/font-size:[^;"]+;?/g, "")
    .replace(/line-height:[^;"]+;?/g, "")
    
    // (3) PC에서 버튼 찌그러짐 유발하는 고정 너비/높이 삭제
    .replace(/width:\s*\d+px;?/g, "width: 100%;")
    .replace(/max-width:\s*\d+px;?/g, "max-width: 100%;")
    .replace(/height:\s*\d+px;?/g, "height: auto;")
    
    // (4) 버튼(링크) 내부 정렬 강제 교정
    .replace(/display:\s*inline-flex/g, "display: flex")
    .replace(/justify-content:[^;"]+;?/g, "justify-content: center;")
    .replace(/align-items:[^;"]+;?/g, "align-items: center;");
}

function getFeaturedImage(post: any) {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
}

async function getPostData(id: string) {
  const res = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const post = await res.json();

  const listRes = await fetch(`https://credivita.com/ai/wp-json/wp/v2/posts?per_page=100&_fields=id,title`, { next: { revalidate: 60 } });
  if (!listRes.ok) return { post, prevPost: null, nextPost: null };
  const allPosts = await listRes.json();
  
  const currentIndex = allPosts.findIndex((p: any) => p.id === parseInt(id));
  const prevPost = allPosts[currentIndex + 1] || null;
  const nextPost = allPosts[currentIndex - 1] || null;

  return { post, prevPost, nextPost };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getPostData(id);
  if (!data || !data.post) return { title: "페이지를 찾을 수 없음" };
  const title = decodeHtmlEntity(data.post.title.rendered);
  return { title: `${title} | Credivita AI`, openGraph: { title, images: getFeaturedImage(data.post) ? [{ url: getFeaturedImage(data.post) }] : [] } };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPostData(id);
  if (!data || !data.post) return notFound();
  const { post, prevPost, nextPost } = data;
  const featuredImage = getFeaturedImage(post);
  const cleanBodyContent = cleanContentStyles(post.content.rendered);

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-5 pt-12">
        <Link href="/" className="text-sm text-slate-500 hover:text-orange-600 mb-8 inline-block">← 목록으로 돌아가기</Link>
        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100">
          <div className="p-6 md:p-12 pb-0">
            <header className="mb-10 text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <time className="text-slate-400 text-sm">{new Date(post.date).toLocaleDateString()}</time>
            </header>
            
            {/* 👇 1. 썸네일 비율 수정 (aspect-square 적용으로 1:1 정사각형 보장) */}
            {featuredImage && (
              <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg mb-12 border border-stone-200">
                <Image src={featuredImage} alt="Featured" fill className="object-cover" priority />
              </div>
            )}

            {/* 👇 2. 본문 디자인 강제 적용 */}
            <div
              className="prose max-w-none text-slate-800 break-words mb-16
                /* 모바일 가독성 */
                prose-p:!text-[18px] prose-p:!leading-[1.85] prose-p:!mb-6
                md:prose-p:!text-[19px] md:prose-p:!leading-[2.0]
                
                /* H2 디자인: 주황색 하단 바 (기존 스타일 삭제됨) */
                prose-h2:!text-[24px] md:prose-h2:!text-[28px] prose-h2:!font-black
                prose-h2:!border-b-[4px] prose-h2:!border-orange-200 prose-h2:!pb-2 prose-h2:!mt-14 prose-h2:!mb-6
                prose-h2:!w-full prose-h2:!block
                
                /* H3 디자인: 왼쪽 주황색 띠 */
                prose-h3:!text-[21px] md:prose-h3:!text-[24px] prose-h3:!font-bold
                prose-h3:!border-l-[6px] prose-h3:!border-orange-500 prose-h3:!pl-4 prose-h3:!mt-10 prose-h3:!mb-4
                
                /* 링크 및 버튼 텍스트 교정 */
                prose-a:!text-orange-600 prose-a:!font-bold prose-a:!no-underline hover:prose-a:!text-orange-800
                prose-strong:!text-orange-700 prose-strong:!font-black
                prose-img:!rounded-2xl prose-img:!shadow-md"
              dangerouslySetInnerHTML={{ __html: cleanBodyContent }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-stone-100">
            {prevPost ? (
              <Link href={`/tool/${prevPost.id}`} className="group relative h-32 md:h-48 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 opacity-40">{getFeaturedImage(prevPost) && <Image src={getFeaturedImage(prevPost)} alt="" fill className="object-cover" />}</div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <span className="text-orange-400 text-xs font-bold mb-2">이전 글</span>
                  <span className="text-white font-bold text-lg line-clamp-2" dangerouslySetInnerHTML={{ __html: prevPost.title.rendered }} />
                </div>
              </Link>
            ) : <div className="h-32 md:h-48 bg-slate-50" />}
            {nextPost ? (
              <Link href={`/tool/${nextPost.id}`} className="group relative h-32 md:h-48 overflow-hidden bg-slate-900 border-l border-slate-700">
                <div className="absolute inset-0 opacity-40">{getFeaturedImage(nextPost) && <Image src={getFeaturedImage(nextPost)} alt="" fill className="object-cover" />}</div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <span className="text-orange-400 text-xs font-bold mb-2">다음 글</span>
                  <span className="text-white font-bold text-lg line-clamp-2" dangerouslySetInnerHTML={{ __html: nextPost.title.rendered }} />
                </div>
              </Link>
            ) : <div className="h-32 md:h-48 bg-slate-50" />}
          </div>
        </article>
      </div>
    </main>
  );
}
