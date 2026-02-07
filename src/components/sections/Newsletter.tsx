"use client";

import { Mail } from "lucide-react";

export default function Newsletter() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/10 -z-10" />

            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden group">

                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-colors duration-1000" />

                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-8 text-primary ring-1 ring-primary/20 shadow-glow">
                        <Mail size={28} />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6 leading-tight">
                        AI 트렌드를 놓치지 마세요
                    </h2>
                    <p className="text-lg text-text-muted mb-10 leading-relaxed">
                        매주 월요일, 엄선된 AI 툴과 할인 정보를 메일함으로 보내드립니다.<br className="hidden sm:block" />
                        이미 10,000명의 크리에이터가 구독하고 있습니다.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="이메일 주소를 입력하세요"
                            className="flex-1 bg-background/50 border border-white/10 rounded-xl px-6 py-4 text-text-main placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all backdrop-blur-sm"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 py-4 transition-all shadow-lg hover:shadow-primary/30 active:scale-95 duration-200"
                        >
                            구독하기
                        </button>
                    </form>

                    <p className="text-sm text-text-muted mt-6">
                        스팸은 보내지 않습니다. 언제든 구독 취소 가능합니다.
                    </p>
                </div>
            </div>
        </section>
    );
}
