"use client";

import { Mail, TrendingUp, Tag } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="space-y-12 font-sans sticky top-32 h-fit">
            {/* Newsletter Widget - Clean Card Style */}
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-700" />

                <div className="flex items-center gap-2 mb-4 text-primary">
                    <Mail size={18} />
                    <span className="text-xs font-bold tracking-wider uppercase">Newsletter</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">AI 트렌드 구독</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">매주 월요일 아침, 가장 핫한 AI 소식을 배달해 드립니다.</p>

                <form className="space-y-3">
                    <input
                        type="email"
                        placeholder="이메일 주소"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900"
                    />
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-95">
                        구독하기
                    </button>
                </form>
            </div>

            {/* Top 5 Articles */}
            <div>
                <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-3">
                    <TrendingUp size={18} className="text-slate-400" />
                    <h3 className="font-serif font-bold text-lg text-slate-800">인기 아티클 Top 5</h3>
                </div>
                <ul className="space-y-5">
                    {[
                        { rank: 1, title: "개발자를 위한 코파일럿 활용법 10가지" },
                        { rank: 2, title: "미드저니 6.0 프롬프트 완벽 가이드" },
                        { rank: 3, title: "무료 AI 글쓰기 툴 비교 분석" },
                        { rank: 4, title: "2024년 AI 마케팅 트렌드 전망" },
                        { rank: 5, title: "노션 AI vs 챗GPT: 무엇을 쓸까?" }
                    ].map((item, i) => (
                        <li key={item.rank} className="group cursor-pointer flex gap-4 items-start py-1">
                            <span className={`text-2xl font-serif font-black transition-colors leading-none w-6 text-center ${i < 3 ? 'text-primary/80' : 'text-slate-200'}`}>
                                {item.rank}
                            </span>
                            <h4 className="text-sm font-medium text-slate-600 group-hover:text-primary leading-snug transition-colors line-clamp-2">
                                {item.title}
                            </h4>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tag Cloud */}
            <div>
                <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-3">
                    <Tag size={18} className="text-slate-400" />
                    <h3 className="font-serif font-bold text-lg text-slate-800">인기 태그</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {["ChatGPT", "영상편집", "Python", "마케팅", "디자인", "생산성", "트렌드", "SaaS", "프롬프트"].map(tag => (
                        <span key={tag} className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-500 text-xs font-semibold rounded-full cursor-pointer transition-all shadow-sm hover:shadow-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </aside>
    );
}
