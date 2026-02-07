"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
            {/* Background Aurora Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 text-center z-10 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-surface/80 border border-white/10 backdrop-blur-md text-sm font-medium text-primary mb-4 shadow-glow">
                        🚀 생산성을 폭발시키는 AI 도구 모음
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight tracking-tight">
                        당신에게 필요한 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                            최고의 AI 도구
                        </span>를 발견하세요
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        전 세계의 AI 툴을 직접 써보고 엄선했습니다.<br className="hidden md:block" />
                        고민할 시간에 여기서 바로 찾아보세요.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
                    className="relative max-w-2xl mx-auto w-full group"
                >
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-text-muted group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-surface/80 border border-white/10 hover:border-white/20 focus:border-primary rounded-2xl py-6 pl-16 pr-32 text-lg text-text-main placeholder:text-text-muted/50 shadow-2xl shadow-primary/5 backdrop-blur-xl transition-all outline-none"
                        placeholder="예: '영상 편집' 또는 '카피라이팅'..."
                    />
                    <div className="absolute inset-y-2 right-2 hidden sm:flex">
                        <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/30 active:scale-95 duration-200">
                            검색
                        </button>
                    </div>
                </motion.div>

                {/* Popular Tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-3 text-sm text-text-muted"
                >
                    <span>인기 태그:</span>
                    {["ChatGPT", "Midjourney", "Notion AI", "Jasper", "Runway"].map(
                        (tag) => (
                            <span
                                key={tag}
                                className="cursor-pointer hover:text-primary transition-colors underline decoration-white/10 underline-offset-4 hover:decoration-primary"
                            >
                                {tag}
                            </span>
                        )
                    )}
                </motion.div>
            </div>
        </section>
    );
}
