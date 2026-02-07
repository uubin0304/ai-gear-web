import Header from "@/components/layout/Header";
import FeaturedPost from "@/components/sections/FeaturedPost";
import Sidebar from "@/components/sections/Sidebar";
import ArticleCard from "@/components/ui/ArticleCard";
import { toolsData } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20">
      <Header />

      {/* 1. Featured Hero */}
      <FeaturedPost />

      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* 2. Main Articles (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8 lg:space-y-12">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900">최신 아티클</h2>
              <span className="text-sm font-sans font-medium text-slate-500 cursor-pointer hover:text-primary transition-colors">
                전체보기 →
              </span>
            </div>

            {/* Mobile: 1 col, Tablet: 2 cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {toolsData.map((tool) => (
                <ArticleCard key={tool.id} {...tool} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center pt-8 lg:pt-12">
              <button className="w-full sm:w-auto px-8 py-3 border border-slate-200 rounded-xl lg:rounded-full text-sm font-medium text-slate-500 hover:bg-white hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm">
                더 많은 글 보기
              </button>
            </div>
          </div>

          {/* 3. Sidebar (Right 4 cols) */}
          {/* Mobile: Stacked at bottom, Tablet/Desktop: Sidebar */}
          <div className="lg:col-span-4 lg:pl-12 border-t lg:border-t-0 lg:border-l border-slate-200 pt-12 lg:pt-0">
            <Sidebar />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xl font-bold font-serif tracking-tight text-slate-900">
              AI<span className="text-primary">Gear</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              크리에이터를 위한 최고의 AI 툴 큐레이션 매거진
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            © 2024 AI Gear. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
