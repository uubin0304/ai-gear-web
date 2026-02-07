import Image from "next/image";
import Link from "next/link";

// 툴 데이터 타입 정의
interface Tool {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

// ✅ 여기에 보내주신 이미지 주소를 넣었습니다!
const tools: Tool[] = [
  {
    id: 1,
    title: "Sora (OpenAI)",
    description: "텍스트만 입력하면 영화 같은 고퀄리티 영상이 생성되는 혁신적인 AI 모델.",
    image: "https://credivita.com/wp-content/uploads/2026/02/Sora-OpenAI.webp",
    category: "영상 제작",
  },
  {
    id: 2,
    title: "Midjourney v6",
    description: "상상하는 모든 것을 예술 작품으로 그려주는 현존 최고의 AI 이미지 생성기.",
    image: "https://credivita.com/wp-content/uploads/2026/02/Midjourney.webp",
    category: "이미지 생성",
  },
  // (예시) 화면이 꽉 차 보이게 같은 걸 2개 더 넣었습니다. 나중에 데이터 연결하면 지우세요!
  {
    id: 3,
    title: "Runway Gen-2",
    description: "영상 편집부터 생성까지, 크리에이터를 위한 올인원 비디오 AI 툴.",
    image: "https://credivita.com/wp-content/uploads/2026/02/Sora-OpenAI.webp", // 임시 이미지
    category: "영상 편집",
  },
  {
    id: 4,
    title: "Stable Diffusion",
    description: "내 컴퓨터에서 돌리는 강력한 오픈소스 AI 그림 도구.",
    image: "https://credivita.com/wp-content/uploads/2026/02/Midjourney.webp", // 임시 이미지
    category: "이미지 생성",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. 히어로 섹션 (메인 타이틀) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            The Best AI Tools Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            AI 툴, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">고민 말고 여기서.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            복잡한 검색 없이 엄선된 최고의 AI 도구들을 만나보세요.<br className="hidden md:block" />
            실전에서 검증된 툴만 모았습니다.
          </p>
          
          {/* 검색창 모양 (장식용) */}
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
          <h2 className="text-2xl font-bold text-slate-900">🔥 지금 핫한 툴</h2>
          <Link href="/all" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            전체보기 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.id}`} // 나중에 상세 페이지 만들면 거기로 이동
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              {/* 이미지 영역 */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* 카테고리 뱃지 */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[11px] font-bold text-white bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                    {tool.category}
                  </span>
                </div>
              </div>

              {/* 텍스트 영역 */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
                  {tool.description}
                </p>
                
                {/* 하단 버튼 모양 */}
                <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors mt-auto">
                  자세히 보기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
