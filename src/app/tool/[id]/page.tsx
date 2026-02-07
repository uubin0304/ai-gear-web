import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

// 워드프레스 글 데이터 타입 정의
interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

// ✅ HTML 태그 제거 함수
function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").replace(/&[^;]+;/gm, " ").trim();
}

// ✅ 데이터 가져오기 함수 (여기가 핵심!)
async function getPost(id: string) {
  try {
    // 👇 [중요] 상세 페이지도 '/ai/' 경로를 포함해야 합니다!
    const res = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Post Fetch Error:", error);
    return null;
  }
}

export default async function ToolDetail({ params }: { params: { id: string } }) {
  // 비동기 파라미터 처리 (Next.js 최신 버전 대응)
  const { id } = await params; 
  const post: WPPost = await getPost(id);

  if (!post) {
    notFound(); // 글이 없으면 404 페이지로 보냄
  }

  // 데이터 가공
  const title = stripHtml(post.title.rendered);
  const content = post.content.rendered; // 본문은 HTML 태그 그대로 사용
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop";
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "AI Tool";
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 상단 네비게이션 */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          목록으로 돌아가기
        </Link>

        {/* 헤더 섹션 */}
        <header className="mb-10 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            {category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {title}
          </h1>
          <time className="text-slate-400 text-sm">{date}</time>
        </header>

        {/* 썸네일 이미지 */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-12 border border-slate-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 본문 콘텐츠 */}
        {/* prose: Tailwind Typography 플러그인 스타일 적용 */}
        <div 
          className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {/* 하단 광고 영역 (선택사항) */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-400 text-sm mb-2">Advertisement</p>
          <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
            광고 영역
          </div>
        </div>

      </article>
    </main>
  );
}
