import Image from "next/image";
import Link from "next/link";

// 카테고리 목록
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

async function getPosts(categoryId?: string): Promise<Tool[]> {
  try {
    const categoryQuery = categoryId ? `&categories=${categoryId}` : "";
    const res = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts?_embed&per_page=100${categoryQuery}`,
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
  const params = await searchParams;
  const currentCategoryId = params.category;
  const tools = await getPosts(currentCategoryId);

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* 🟠 1. 배경 오로라 효과 (globals.css 애니메이션 연동) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* 🟠 2. 상단 뱃지 (주황색) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            실시간 업데이트 중
          </div>

          {/* 🟠 3. 메인 타이틀 (둥둥 뜨는 애니메이션 + 그라데이션) */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight cursor-default">
            AI 툴, <br className="md:hidden" />
            <span className="inline-block animate-float text-gradient-sun pb-2 drop-shadow-sm">
              고민 말고 여기서.
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            복잡한 검색은 이제 그만. <br className="md:hidden" />
            엄선된 AI 도구와 가이드로 생산성을 200% 높여보세요.
          </p>
          
          {/* 🟠 4. 카테고리 탭 (주황색 버튼) */}
          <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-6 pt-2 px-4 no-scrollbar scroll-smooth">
            {AI_CATEGORIES.map((cat) => {
              const isActive = (currentCategoryId === cat.id?.toString()) || (!currentCategoryId && !cat.id);
              return (
                <Link
                  key={cat.slug}
                  href={cat.id ? `/?category=${cat.id}` : "/"}
                  className={`
                    relative px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ease-out border backdrop-blur-md
                    ${isActive 
                      ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105" 
                      : "bg-white/60 border-white/50 text-slate-600 hover:bg-white hover:border-orange-300 hover:text-orange-600 hover:shadow-md hover:-translate-y-1"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{cat.name.split(" ")[0]}</span>
                    <span>{cat.name.split(" ")[1]}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 리스트 섹션 */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {tools.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-orange-200">
            <p className="text-xl text-slate-600 font-medium mb-2">아직 등록된 글이 없어요! 😅</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tool/${tool.id}`} className="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                  <Image src={tool.image} alt={tool.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-black/40 backdrop-blur-md rounded-full border border-white/10 uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  {/* 제목 호버 시 주황색 */}
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-orange-600 text-lg transition-colors">{tool.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
