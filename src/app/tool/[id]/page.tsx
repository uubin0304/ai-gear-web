import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// 타입 정의
interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string; id: number }>>;
  };
}

interface NavPost {
  id: number;
  title: string;
  image: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").replace(/&[^;]+;/gm, " ").trim();
}

// 1. 현재 글 가져오기
async function getPost(id: string) {
  try {
    const res = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// 2. [New] 이전 글 / 다음 글 가져오기
async function getAdjacentPosts(currentDate: string) {
  try {
    // 워드프레스 API 날짜 포맷 (ISO 8601)
    const date = new Date(currentDate).toISOString();

    // 이전 글 (현재 날짜보다 이전인 글 중 1개)
    const prevRes = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts?_embed&per_page=1&order=desc&orderby=date&before=${date}`,
      { next: { revalidate: 60 } }
    );
    
    // 다음 글 (현재 날짜보다 이후인 글 중 1개)
    const nextRes = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts?_embed&per_page=1&order=asc&orderby=date&after=${date}`,
      { next: { revalidate: 60 } }
    );

    const prevData = prevRes.ok ? await prevRes.json() : [];
    const nextData = nextRes.ok ? await nextRes.json() : [];

    const formatPost = (post: any): NavPost => ({
      id: post.id,
      title: stripHtml(post.title.rendered),
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    });

    return {
      prev: prevData.length > 0 ? formatPost(prevData[0]) : null,
      next: nextData.length > 0 ? formatPost(nextData[0]) : null,
    };

  } catch (error) {
    return { prev: null, next: null };
  }
}

// 3. 관련 글 가져오기
async function getRelatedPosts(categoryId: number, currentPostId: number) {
  try {
    const res = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts?_embed&categories=${categoryId}&exclude=${currentPostId}&per_page=4`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    
    return posts.map((post: any) => ({
      id: post.id,
      title: stripHtml(post.title.rendered),
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600",
      category: post._embedded?.["wp:term"]?.[0]?.[0]?.name || "AI Tool",
    }));
  } catch (error) {
    return [];
  }
}

export default async function ToolDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post: WPPost = await getPost(id);

  if (!post) notFound();

  const categoryId = post.categories?.[0] || 1;
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "AI Tool";
  
  // 데이터 병렬로 가져오기 (관련글 + 이전/다음글)
  const [relatedPosts, adjacentPosts] = await Promise.all([
    getRelatedPosts(categoryId, post.id),
    getAdjacentPosts(post.date)
  ]);

  const title = stripHtml(post.title.rendered);
  const content = post.content.rendered;
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200";
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      
      {/* 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
         <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        
        {/* 네비게이션 */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          ← 목록으로 돌아가기
        </Link>

        {/* 본문 카드 */}
        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-stone-100 mb-16">
            <header className="mb-10 text-center">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-orange-600 uppercase bg-orange-50 rounded-full">
                {categoryName}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight break-keep">
                {title}
              </h1>
              <time className="text-slate-400 text-sm">{date}</time>
            </header>

            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg mb-12 border border-stone-200">
              <Image src={image} alt={title} fill className="object-cover" priority />
            </div>

            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-800 prose-img:rounded-xl break-words"
              dangerouslySetInnerHTML={{ __html: content }}
            />
        </article>

        {/* ✨ [New] 이전글 / 다음글 네비게이션 */}
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {/* 이전 글 */}
          {adjacentPosts.prev ? (
            <Link href={`/tool/${adjacentPosts.prev.id}`} className="group relative h-32 md:h-40 rounded-xl overflow-hidden border border-stone-200">
              {/* 배경 이미지 */}
              <Image src={adjacentPosts.prev.image} alt="prev" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {/* 어두운 오버레이 */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
              {/* 텍스트 내용 */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start text-white">
                <span className="text-xs font-bold text-orange-300 mb-1 uppercase tracking-wider">Previous</span>
                <span className="text-lg font-bold leading-tight line-clamp-2 group-hover:underline decoration-orange-400 underline-offset-4">
                  {adjacentPosts.prev.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="hidden md:block"></div> /* 빈 공간 채우기 */
          )}

          {/* 다음 글 */}
          {adjacentPosts.next ? (
            <Link href={`/tool/${adjacentPosts.next.id}`} className="group relative h-32 md:h-40 rounded-xl overflow-hidden border border-stone-200 text-right">
              <Image src={adjacentPosts.next.image} alt="next" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-end text-white">
                <span className="text-xs font-bold text-orange-300 mb-1 uppercase tracking-wider">Next</span>
                <span className="text-lg font-bold leading-tight line-clamp-2 group-hover:underline decoration-orange-400 underline-offset-4">
                  {adjacentPosts.next.title}
                </span>
              </div>
            </Link>
          ) : (
             <div className="hidden md:block"></div>
          )}
        </nav>

        {/* 관련 툴 섹션 */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-stone-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span>👀</span> 이 툴과 비슷한 <span className="text-orange-600">{categoryName}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedPosts.map((item: any) => (
                <Link key={item.id} href={`/tool/${item.id}`} className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-orange-400 hover:shadow-md transition-all">
                  <div className="relative aspect-square w-full bg-stone-100">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
