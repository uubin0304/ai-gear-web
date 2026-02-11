import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// 1. 데이터를 가져올 때 '_embed'를 꼭 붙여야 썸네일 정보가 옵니다!
async function getPost(id: string) {
  const res = await fetch(
    `https://credivita.com/ai/wp-json/wp/v2/posts/${id}?_embed`, 
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return undefined;
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // params를 await로 먼저 풀어줘야 합니다.
  const { id } = await params; 
  const post = await getPost(id);

  if (!post) return notFound();
  // ... 나머지 동일

  // 2. 워드프레스 썸네일 주소 추출하기 (없으면 기본 이미지 사용)
  const featuredImage = 
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80"; // 기본값(기존 사진)

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      {/* ... 배경 효과 등 기존 코드 유지 ... */}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
          ← 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-stone-100 mb-16">
          <header className="mb-10 text-center">
            {/* 카테고리 등 기존 코드 유지 */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight break-keep" 
                dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <time className="text-slate-400 text-sm">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </header>

          {/* 👇 여기가 핵심! 이미지를 featuredImage 변수로 교체 */}
          <div className="relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-lg mb-12 border border-stone-200">
            <Image
              src={featuredImage} 
              alt={post.title.rendered}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div
            className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-800 prose-img:rounded-xl break-words"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>
      </div>
    </main>
  );
}
