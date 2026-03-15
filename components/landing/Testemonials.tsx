'use client'

import { motion } from "framer-motion";
import FadeUp from "../FadeUp";
import StaggerChildren, { StaggerItem } from "../StaggerChildren";

const testimonials = [
    {
        quote: "I described my daughter Layla's obsession with space and her fear of dogs. DreamBook made her the hero of a story where she helps a lost puppy find its way back from the moon. She's asked to read it every night for two weeks.",
        author: "Sarah M.",
        role: "Mother of 2, Dubai",
        initials: "SM",
    },
    {
        quote: "As a teacher I use DreamBook to create stories that address specific social situations my students are dealing with. The personalization is genuinely remarkable — these aren't templates.",
        author: "James T.",
        role: "Primary school teacher, London",
        initials: "JT",
    },
    {
        quote: "My son has been struggling to read. Having a story that's literally about him — his name, his pet, his football team — made him actually want to pick it up. That's worth everything.",
        author: "Carlos R.",
        role: "Father of 1, Madrid",
        initials: "CR",
    },
];

export default function Testimonials() {
    return (
        <section className="py-32 max-w-6xl mx-auto px-6">
            <FadeUp className="text-center mb-16">
                <div className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">Stories</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Families love DreamBook.
                </h2>
            </FadeUp>

            <StaggerChildren className="grid md:grid-cols-3 gap-6" stagger={0.12}>
                {testimonials.map((t) => (
                    <StaggerItem key={t.author}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="p-6 rounded-2xl border border-border bg-card flex flex-col h-full"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-primary text-sm">★</span>
                                ))}
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic mb-6">
                                "{t.quote}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">{t.author}</div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </StaggerItem>
                ))}
            </StaggerChildren>
        </section>
    );
}