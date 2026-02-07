import Image from "next/image";
import Link from "next/link";

// 1. 워드프레스 데이터 타입 (필요한 것만 쏙)
interface WPPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    "wp:term"?: Array<Array<{
      name: string;
    }>>;
  };
}

// 2. 우리 사이트에서 쓸 깔끔한 데이터 타입
interface Tool {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
}

// ✅ HTML 태그 청소기 (지저분한 태그 제거)
function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").replace(/&[^;]+;/gm, " ").trim();
}

// ✅ 워드프레스 데이터 가져오기 (카테고리 5195번만!)
async function getPosts(): Promise<Tool[]> {
  try {
    // 👇 여기가 핵심! '&categories=5195'를 추가했습니다.
    const res = await fetch(
      "https://credivita.com/ai/wp-json/wp/v2/posts?_embed&per_page=12", 
      {
        next: { revalidate: 60 }, // 60초마다 데이터 갱신 (새 글 바로 반영)
      }
    );

    if (!res.ok) {
      // 카테고리에 글이 하나도 없으면 400 에러가 날 수 있음 -> 빈 배열 반환
      return [];
    }

    const posts: WPPost[] = await res.json();

    return posts.map((post) => {
      // 이미지 없으면 기본 이미지(파란색 느낌) 사용
      const image =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60"; 

      // 카테고리 이름 가져오기
      const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "AI Tool";

      return {
        id: post.id,
        title: stripHtml(post.title.rendered),
        description: stripHtml(post.excerpt.rendered).slice(0, 80) + "...", // 80자로 깔끔하게 자름
        image: image,
        category: category,
        link: post.link, // 클릭하면 워드프레스 원문으로 이동
      };
    });
  } catch (error) {
    console.error("Wordpress Fetch Error:", error);
    return [];
  }
}

export default async function Home() {
  const tools = await getPosts();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. 히어로 섹션 */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            The Best AI Tools Collection
          </span>
          
          {/* 👇 아까 요청하신 호버 효과 적용됨! */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            AI 툴, <span className="text-blue-600 inline-block transition-all duration-300 hover:scale-110 hover:text-blue-800 hover:rotate-2 cursor-default">고민 말고 여기서.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            복잡한 검색 없이 엄선된 최고의 AI 도구들을 만나보세요.<br className="hidden md:block" />
            실전에서 검증된 툴만 모았습니다.
          </p>
          
          {/* 검색창 (모양만) */}
          <div className="mt-10 max-w-md mx-auto relative">
            <input 
              type="text" 
              placeholder="어떤 AI 툴을 찾고 계신가요?" 
              className="w-full px-6 py-4 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 pl-12"
            />
            <svg className="w-6 h-6 text-slate-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
      </section>

      {/* 2. 툴 리스트 그리드 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">🔥 최신 업데이트</h2>
          <Link href="/all" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            전체보기 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>

        {/* 데이터 유무에 따른 화면 표시 */}
        {tools.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-xl text-slate-600 font-medium mb-2">아직 등록된 AI 툴이 없네요! 😅</p>
            <p className="text-slate-400">워드프레스에서 <strong>'AI 툴' 카테고리(ID: 5195)</strong>로 글을 작성하면 여기에 나타납니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tools.map((tool) => (
              <a
                key={tool.id}
                href={`/tool/${tool.id}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
              >
                {/* 이미지 */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[11px] font-bold text-white bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                      {tool.category}
                    </span>
                  </div>
                </div>

                {/* 텍스트 */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors mt-auto">
                    리뷰 읽기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
