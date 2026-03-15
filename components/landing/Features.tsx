'use client'

import { motion } from "framer-motion";
import StaggerChildren, { StaggerItem } from "../StaggerChildren";
import FadeUp from "../FadeUp";

const features = [
    {
        icon: "🎤",
        title: "Just describe your child",
        desc: "Tell us their name, age, interests, and a lesson you want them to learn. Type it or say it with your voice.",
    },
    {
        icon: "✨",
        title: "AI writes & illustrates",
        desc: "Gemini crafts a unique narrative while Imagen 3 generates beautiful illustrations — simultaneously, in real-time.",
    },
    {
        icon: "🔊",
        title: "Narrated aloud",
        desc: "Every page has a warm audio narration, perfectly paced for bedtime reading. Press play and listen together.",
    },
    {
        icon: "📖",
        title: "Download as a PDF",
        desc: "Every story exports to a beautifully formatted PDF storybook you can print, share, or keep forever.",
    },
    {
        icon: "🌍",
        title: "Any language",
        desc: "Stories in English, Spanish, French, Arabic, Urdu, and 10+ more. Perfect for bilingual families.",
    },
    {
        icon: "🎨",
        title: "Choose your style",
        desc: "Watercolor, cartoon, pencil sketch, or digital art. Each illustration style creates a completely different mood.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-32 max-w-6xl mx-auto px-6">
            <FadeUp className="text-center mb-16">
                <div className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">Features</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Everything a story needs.
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    From voice input to printed keepsake — DreamBook handles every step of the journey.
                </p>
            </FadeUp>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
                {features.map((f) => (
                    <StaggerItem key={f.title}>
                        <motion.div
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors duration-300"
                        >
                            <div className="text-3xl mb-4">{f.icon}</div>
                            <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </motion.div>
                    </StaggerItem>
                ))}
            </StaggerChildren>
        </section>
    );
}