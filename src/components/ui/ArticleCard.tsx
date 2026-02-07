"use client";

import Image from "next/image";
import { Link, Copy, Check, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    link: string;
    priceType: "무료" | "부분유료" | "유료";
    author?: string;
    date?: string;
    readTime?: string;
    discountCode?: string;
}

export default function ArticleCard({
    title,
    description,
    category,
    imageUrl,
    link,
    priceType,
    author,
    date,
    readTime,
    discountCode,
}: ArticleCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        if (discountCode) {
            navigator.clipboard.writeText(discountCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            className="group flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100 hover:shadow-xl transition-all duration-300 ease-out"
            whileHover={{ y: -4 }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800 rounded-md shadow-sm uppercase tracking-wider">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium font-sans mb-1">
                    {date && <span>{date}</span>}
                    {readTime && (
                        <>
                            <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><Clock size={10} /> {readTime}</span>
                        </>
                    )}
                </div>

                <h3 className="text-xl font-serif font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors decoration-primary/30 group-hover:underline underline-offset-4 decoration-2">
                    {title}
                </h3>

                <p className="text-sm text-slate-500 font-sans leading-relaxed line-clamp-2">
                    {description}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={12} />
                        </div>
                        {author}
                    </div>

                    <div className="flex items-center gap-3">
                        {discountCode && (
                            <button
                                onClick={handleCopy}
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? "복사됨" : "할인코드"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
