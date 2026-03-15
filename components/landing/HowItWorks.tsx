'use client'

import { useState } from "react";
import FadeUp from "../FadeUp";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";

const steps = [
    {
        number: "01",
        title: "Describe your child",
        desc: 'Tell us who they are. "Emma, age 5, loves dinosaurs and is scared of thunder. I want her to learn that being brave doesn\'t mean not being scared."',
        detail: "Type it or use the voice button — speak naturally and we'll understand.",
    },
    {
        number: "02",
        title: "Watch it come to life",
        desc: "Our AI begins generating your story instantly. Text, illustrations, and narration all stream in live — you watch the book build, page by page, in real time.",
        detail: "No waiting for a download. The experience starts in seconds.",
    },
    {
        number: "03",
        title: "Read it together",
        desc: "Sit with your child and read the finished story together. Tap any page to hear it narrated aloud in a warm, expressive voice.",
        detail: "Every story is saved to your library forever.",
    },
    {
        number: "04",
        title: "Keep it forever",
        desc: "Download your story as a beautifully formatted PDF storybook. Print it, gift it, or keep it in your family's library.",
        detail: "Stories make the most personal, memorable gifts.",
    },
];

export default function HowItWorks() {
    const [active, setActive] = useState(0);

    return (
        <section id="how-it-works" className="py-32 bg-muted/20 border-y border-border">
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="text-center mb-16">
                    <div className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">How it works</div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        From idea to storybook in minutes.
                    </h2>
                </FadeUp>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Steps */}
                    <div className="space-y-3">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                onClick={() => setActive(i)}
                                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${active === i
                                        ? "bg-primary/5 border-primary/30"
                                        : "bg-transparent border-transparent hover:border-border hover:bg-muted/50"
                                    }`}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`text-xs font-bold font-mono mt-0.5 transition-colors ${active === i ? "text-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                    <div>
                                        <div className={`font-semibold mb-1 transition-colors ${active === i ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step.title}
                                        </div>
                                        <AnimatePresence>
                                            {active === i && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{step.desc}</p>
                                                    <p className="text-xs text-primary mt-2">{step.detail}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Visual preview panel */}
                    <FadeUp delay={0.2}>
                        <div className="relative rounded-3xl overflow-hidden bg-card border border-border aspect-square flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center"
                                >
                                    <div className="text-6xl mb-6">{["🎤", "⚡", "📖", "🎁"][active]}</div>
                                    <div className="text-2xl font-bold mb-3">{steps[active].title}</div>
                                    <div className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                        {steps[active].detail}
                                    </div>

                                    {/* Step indicator dots */}
                                    <div className="flex gap-2 mt-8">
                                        {steps.map((_, i) => (
                                            <Button
                                                key={i}
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => setActive(i)}
                                                className={`h-1.5 min-h-0 p-0 rounded-full transition-all duration-300 ${
                                                    i === active ? "w-6 bg-primary" : "w-1.5 bg-border"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}