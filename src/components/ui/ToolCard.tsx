"use client";

import Image from "next/image";
import { Link, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    link: string;
    priceType: "무료" | "부분유료" | "유료";
    discountCode?: string;
    isSale?: boolean;
}

export default function ToolCard({
    title,
    description,
    category,
    imageUrl,
    link,
    priceType,
    discountCode,
    isSale,
}: ToolCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click
        if (discountCode) {
            navigator.clipboard.writeText(discountCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="group relative rounded-xl border border-white/5 bg-surface backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-glow hover:border-primary/50 transition-colors"
        >
            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden bg-slate-800">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                    {isSale && (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-primary rounded-lg shadow-lg animate-pulse">
                            SALE
                        </span>
                    )}
                    <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-lg text-white backdrop-blur-md shadow-sm",
                        priceType === "무료" ? "bg-emerald-500/90" : "bg-slate-900/80"
                    )}>
                        {priceType}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-main group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-base text-text-muted line-clamp-2 mt-2 leading-relaxed min-h-[48px]">
                        {description}
                    </p>
                </div>

                {/* Footer: Tags & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-medium text-text-muted bg-background px-2.5 py-1 rounded-lg">
                        #{category}
                    </span>

                    <div className="flex items-center gap-2">
                        {discountCode && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                                title="할인코드 복사"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "복사됨!" : discountCode}
                            </button>
                        )}

                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md hover:shadow-lg shadow-blue-500/20"
                        >
                            방문하기 <Link size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
