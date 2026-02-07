"use client";

import { Search, Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navigation = [
        { name: "영상", href: "#" },
        { name: "글쓰기", href: "#" },
        { name: "이미지", href: "#" },
        { name: "코딩", href: "#" },
        { name: "마케팅", href: "#" },
    ];

    // Lock body scroll when menu/search is open
    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen, isSearchOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 h-16 flex items-center transition-all duration-300">
                <div className="container mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50 relative">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6 text-white"
                            >
                                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                                <path d="M8.5 8.5v.01" />
                                <path d="M16 16v.01" />
                                <path d="M12 12v.01" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                            AI<span className="text-blue-600">Gear</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Search */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요..."
                            className="w-64 bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Search size={22} />
                        </button>
                        <button
                            className="p-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col lg:hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <span className="text-lg font-bold text-slate-900">메뉴</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 -mr-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                                {navigation.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-between p-4 rounded-xl text-xl font-bold text-slate-800 hover:bg-slate-50 hover:text-primary transition-all active:scale-95"
                                        >
                                            {item.name}
                                            <ChevronRight size={20} className="text-slate-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                <Link
                                    href="#"
                                    className="flex justify-center items-center gap-2 w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
                                >
                                    뉴스레터 구독하기
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
                    >
                        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="무엇을 찾고 계신가요?"
                                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 text-slate-500 font-medium"
                            >
                                취소
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">인기 검색어</h3>
                            <div className="flex flex-wrap gap-2">
                                {["ChatGPT", "영상편집", "Sora", "Notion", "생산성"].map(tag => (
                                    <button key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium active:bg-slate-100">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
