import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// 타입 정의
interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  categories: number[]; // 카테고리 ID 배열
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string; id: number }>>;
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").replace(/&[^;]+;/gm, " ").trim();
}

// 1. 상세 글 가져오기
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

// 2. ✨ [New] 관련 글 가져오기 (같은 카테고리, 현재 글 제외)
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

  // 현재 글의 첫 번째 카테고리 ID 추출
  const categoryId = post.categories?.[0] || 1;
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "AI Tool";
  
  // 관련 글 데이터 가져오기
  const relatedPosts = await getRelatedPosts(categoryId, post.id);

  const title = stripHtml(post.title.rendered);
  const content = post.content.rendered;
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200";
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen bg-stone-50 py-12 relative overflow-hidden">
      
      {/* 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
         <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 네비게이션 */}
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          ← 목록으로 돌아가기
        </Link>

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

        {/* ✨ [New] 함께 보면 좋은 툴 섹션 (Internal Linking) */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span>👉</span> 이런 <span className="text-orange-600">{categoryName}</span> 툴은 어때요?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedPosts.map((item) => (
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
