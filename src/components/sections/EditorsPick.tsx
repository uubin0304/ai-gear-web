"use client";

import { toolsData } from "@/lib/data";
import ToolCard from "@/components/ui/ToolCard";
import { motion } from "framer-motion";

export default function EditorsPick() {
    const featuredTools = toolsData.filter((tool) => tool.featured);

    return (
        <section className="py-24 container mx-auto px-6 relative">
            <div className="flex items-center gap-6 mb-12">
                <h2 className="text-3xl font-bold text-text-main flex items-center gap-3">
                    <span className="text-yellow-400 drop-shadow-md">✨</span> 에디터 추천
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredTools.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    >
                        <ToolCard {...tool} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
