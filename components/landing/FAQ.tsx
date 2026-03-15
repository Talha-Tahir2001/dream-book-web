'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import FadeUp from "../FadeUp";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const faqs = [
    {
        q: "How personalized are the stories really?",
        a: "Very. Each story is generated from scratch based on your child's name, age, interests, fears, and the lesson you want to teach. No two stories are alike — even with similar inputs, the AI produces unique narratives every time.",
    },
    {
        q: "How long does it take to generate a story?",
        a: "The story starts appearing on screen within seconds of you clicking 'Generate'. Text streams in live, and illustrations and narration follow page by page. A full 8-page story is complete in under 2 minutes.",
    },
    {
        q: "What age range is DreamBook for?",
        a: "Stories work best for children aged 2–10. You specify the child's age and DreamBook adjusts the vocabulary, sentence length, and themes automatically.",
    },
    {
        q: "Can I edit a story after it's generated?",
        a: "Light editing (regenerating a specific page, swapping an illustration) is available on the Family plan. Full manual editing is coming soon.",
    },
    {
        q: "What languages are supported?",
        a: "English, Spanish, French, German, Arabic, Urdu, Portuguese, Italian, Japanese, Korean, Hindi, Mandarin, Dutch, Polish, and Swedish. More coming soon.",
    },
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-32 max-w-3xl mx-auto px-6">
            <FadeUp className="text-center mb-14">
                <div className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">FAQ</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Questions answered.
                </h2>
            </FadeUp>

            <div className="space-y-2">
                {faqs.map((faq, i) => (
                    <FadeUp key={faq.q} delay={i * 0.05}>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(open === i ? null : i)}
                            className="w-full h-auto text-left p-5 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all duration-200 group flex flex-col items-stretch"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-medium text-sm">{faq.q}</span>
                                <motion.span
                                    animate={{ rotate: open === i ? 45 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-muted-foreground text-lg shrink-0 group-hover:text-primary transition-colors"
                                >
                                    <Plus />
                                </motion.span>
                            </div>
                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-sm text-muted-foreground leading-relaxed mt-3 pr-8">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </FadeUp>
                ))}
            </div>
        </section>
    );
}