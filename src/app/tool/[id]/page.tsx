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

// ✅ 데이터 가져오기 함수
async function getPost(id: string) {
  try {
    const res = await fetch(
      `https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`,
      { next: { revalidate: 60 } }
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

// ✨ [핵심 기능] 본문에서 목차 데이터 추출 & ID 심기
function generateTOC(content: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  let count = 0;

  // 정규식으로 h2, h3 태그 찾아서 ID 심기
  const modifiedContent = content.replace(
    /<h([2-3])>(.*?)<\/h\1>/g,
    (match, level, text) => {
      const id = `section-${count++}`;
      const cleanText = stripHtml(text);
      toc.push({ id, text: cleanText, level: parseInt(level) });
      // scroll-mt-24: 헤더에 가려지지 않게 여유 공간 확보
      return `<h${level} id="${id}" class="scroll-mt-24 font-bold text-slate-900 mb-4 mt-8">${text}</h${level}>`;
    }
  );

  return { toc, modifiedContent };
}

export default async function ToolDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post: WPPost = await getPost(id);

  if (!post) {
    notFound();
  }

  // 목차 생성 실행
  const { toc, modifiedContent } = generateTOC(post.content.rendered);

  // 데이터 가공
  const title = stripHtml(post.title.rendered);
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
    <main className="min-h-screen bg-slate-50 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 상단 네비게이션 */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          목록으로 돌아가기
        </Link>

        {/* 2단 레이아웃 그리드 (왼쪽: 본문 / 오른쪽: 목차) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* 📜 왼쪽: 메인 본문 (8칸 차지) */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            {/* 헤더 섹션 */}
            <header className="mb-10 text-center">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                {category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                {title}
              </h1>
              <time className="text-slate-400 text-sm">{date}</time>
            </header>

            {/* 썸네일 이미지 (정사각형 비율 유지 + 중앙 정렬) */}
            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg mb-12 border border-slate-200">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 본문 콘텐츠 (목차 ID가 적용됨) */}
            <div
              className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: modifiedContent }}
            />
          </article>

          {/* ⚓ 오른쪽: 따라다니는 목차 (4칸 차지 - 광고 제거됨) */}
          <aside className="hidden lg:block lg:col-span-4 h-full">
            <div className="sticky top-24">
              
              {/* 목차 카드 */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  ON THIS PAGE
                </h3>

                {toc.length === 0 ? (
                  <p className="text-sm text-slate-400">목차가 없습니다.</p>
                ) : (
                  <ul className="space-y-3">
                    {toc.map((item) => (
                      <li key={item.id} className={`${item.level === 3 ? "ml-4" : ""}`}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-slate-600 hover:text-blue-600 hover:font-bold transition-all block py-1 border-l-2 border-transparent hover:border-blue-500 pl-3 -ml-[1px]"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
