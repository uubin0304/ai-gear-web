"use client";

import { useState } from "react";
import { toolsData } from "@/lib/data";
import ToolCard from "@/components/ui/ToolCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ALL_CATEGORY = "전체";
const CATEGORIES = [ALL_CATEGORY, ...Array.from(new Set(toolsData.map((t) => t.category)))];

export default function ToolGrid() {
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

    const filteredTools =
        activeCategory === ALL_CATEGORY
            ? toolsData
            : toolsData.filter((tool) => tool.category === activeCategory);

    return (
        <section className="py-24 container mx-auto px-6 min-h-screen bg-gradient-to-b from-background to-surface/30">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                            activeCategory === category
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                : "bg-surface/50 text-text-muted hover:text-white hover:bg-surface border-white/5 hover:border-white/10"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool) => (
                        <motion.div
                            layout
                            key={tool.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
                        >
                            <ToolCard {...tool} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredTools.length === 0 && (
                <div className="text-center py-32 text-text-muted">
                    <p className="text-xl">해당 카테고리에 도구가 없습니다.</p>
                </div>
            )}
        </section>
    );
}
