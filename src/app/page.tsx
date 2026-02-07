import Image from "next/image";
import Link from "next/link";

// 1. 카테고리 설정 (알려주신 ID 반영)
const AI_CATEGORIES = [
  { name: "🏠 전체", id: null, slug: "all" },
  { name: "🛠️ 가이드", id: 14, slug: "guide" },
  { name: "🆕 소식", id: 15, slug: "news" },
  { name: "🔍 툴 소개", id: 16, slug: "tools" },
  { name: "🎁 프로모션", id: 17, slug: "promo" },
  { name: "📂 기타", id: 1, slug: "etc" },
];

interface Tool {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").replace(/&[^;]+;/gm, " ").trim();
}

// 2. 데이터 가져오기 (카테고리 필터 추가)
async function getPosts(categoryId?: string): Promise<Tool[]> {
  try {
    // 카테고리 ID가 있으면 쿼리에 추가합니다.
    const categoryQuery = categoryId ? `&categories=${categoryId}` : "";
    const res = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts?_embed&per_page=12${categoryQuery}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return [];
    const posts = await res.json();

    return posts.map((post: any) => ({
      id: post.id,
      title: stripHtml(post.title.rendered),
      description: stripHtml(post.excerpt.rendered).slice(0, 80) + "...",
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
      category: post._embedded?.["wp:term"]?.[0]?.[0]?.name || "AI Tool",
    }));
  } catch (error) {
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
  // 현재 선택된 카테고리 ID 확인
  const currentCategoryId = (await searchParams).category;
  const tools = await getPosts(currentCategoryId);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 히어로 섹션 */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
            AI 툴, <span className="text-blue-600">고민 말고 여기서.</span>
          </h1>
          
          {/* 📱 3단계: 카테고리 탭 메뉴 (가로 스크롤 가능) */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {AI_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.id ? `/?category=${cat.id}` : "/"}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  (currentCategoryId === cat.id?.toString()) || (!currentCategoryId && !cat.id)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 리스트 섹션 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {tools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">이 카테고리에는 아직 글이 없어요! 😅</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tool/${tool.id}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-all flex flex-col h-full">
                {/* 이미지 - 정사각형 반영 */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src={tool.image} alt={tool.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-tight">{tool.category}</span>
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600">{tool.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4">{tool.description}</p>
                  <div className="mt-auto text-xs font-bold text-slate-400">자세히 보기 →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
