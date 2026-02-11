import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 🛠️ 1. 특수문자 디코딩 함수 (제목 깨짐 방지)
function decodeHtmlEntity(str: string) {
  if (!str) return "";
  return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
}

async function getPost(id: string) {
  const res = await fetch(
    `https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, 
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return undefined;
  return res.json();
}

// 🛠️ 2. 메타데이터 생성 (SEO, 브라우저 탭 제목 변경)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return { title: "페이지를 찾을 수 없음" };

  const title = decodeHtmlEntity(post.title.rendered);
  const description = post.excerpt?.rendered 
    ? post.excerpt.rendered.replace(/<[^>]*>?/gm, "").slice(0, 100) 
    : "AI 툴 상세 정보";
  
  const ogImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    title: `${title} | Credivita AI`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const post = await getPost(id);

  if (!post) return notFound();

  // 🛠️ 3. Unsplash 제거하고 로컬 이미지나 빈 값 사용
  // 이미지가 없으면 null을 반환하도록 설정
  const featuredImage = 
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

  // 제목 디코딩
  const cleanTitle = decodeHtmlEntity(post.title.rendered);

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      
      {/* (배경 효과는 그대로 두시면 됩니다) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          ← 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-stone-100 mb-16">
          <header className="mb-10 text-center">
            {/* 제목: dangerouslySetInnerHTML 사용 (HTML 태그 허용) */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight break-keep" 
                dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <time className="text-slate-400 text-sm">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </header>

          {/* 🛠️ 이미지가 있을 때만 렌더링하도록 조건부 처리 */}
          {featuredImage ? (
            <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg mb-12 border border-stone-200">
              <Image
                src={featuredImage} 
                alt={cleanTitle} // 🛠️ 깨끗한 제목 사용
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            // 이미지가 없을 때 보여줄 대체 UI (선택 사항)
            <div className="w-full h-px bg-slate-100 mb-12"></div>
          )}

          <div
            className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-800 prose-img:rounded-xl break-words"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>
      </div>
    </main>
  );
}
