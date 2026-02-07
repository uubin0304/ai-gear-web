"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FeaturedPost() {
    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-slate-50">
            {/* Pastel Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-emerald-50/50 -z-10" />

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/60 text-xs font-bold text-primary shadow-sm mb-4">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            WEEKLY FEATURE
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                            AI 영상 혁명: <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 relative">
                                Sora vs Runway
                            </span>
                            <br className="hidden sm:block" /> 승자는?
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans font-light">
                            텍스트-투-비디오 기술이 임계점을 넘었습니다. <br className="hidden sm:block" />
                            오픈AI의 Sora와 런웨이 Gen-3를 직접 비교 분석하고, <br className="hidden lg:block" />
                            크리에이터를 위한 최적의 선택지를 제안합니다.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4 font-sans">
                            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 group text-sm sm:text-base">
                                지금 읽기 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                                <span>By 김에디터 · 8분 소요</span>
                            </div>
                        </div>
                    </div>

                    {/* Large Thumbnail */}
                    <div className="flex-1 w-full max-w-3xl order-1 lg:order-2 perspective-1000">
                        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 ring-1 ring-slate-900/5 bg-white transform transition-transform hover:rotate-1 hover:scale-[1.02] duration-500 ease-out-back">
                            <Image
                                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop"
                                alt="Featured Article"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Gradient Overlay for Text Readability if needed, but keeping clean for now */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
