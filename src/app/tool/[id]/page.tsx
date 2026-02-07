import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// 워드프레스 글 1개 가져오기
async function getPost(id: string) {
  const res = await fetch(`https://credivita.com/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  // 이미지 & 내용 정리
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder.jpg";
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Review";

  return (
    <article className="min-h-screen bg-white">
      {/* 1. 상단 헤더 이미지 */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <Image
          src={image}
          alt={post.title.rendered}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-4xl mx-auto">
          <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">
            {category}
          </span>
          <h1 
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
          />
        </div>
      </div>

      {/* 2. 본문 내용 (워드프레스 내용이 여기에 뜸) */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 본문 스타일링 (Prose) */}
        <div 
          className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl prose-a:text-blue-600 hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        
        {/* 하단 버튼 */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
          <Link href="/" className="text-slate-500 hover:text-slate-900 font-semibold">
            ← 목록으로 돌아가기
          </Link>
          <a 
            href={post.link} 
            target="_blank" 
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
          >
            워드프레스 원문 보기
          </a>
        </div>
      </div>
    </article>
  );
}
