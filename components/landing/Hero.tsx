'use client'
import { motion } from "framer-motion";
import Link from "next/link";
import FloatingBook from "../FloatingBook";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left — text */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Powered by Gemini AI · Google Cloud
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
                    >
                        A storybook
                        <br />
                        <span className="text-primary italic">made for</span>
                        <br />
                        your child.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
                    >
                        Describe your child in a few words. DreamBook weaves a fully illustrated,
                        narrated storybook — personalized to their name, interests, and the lesson
                        you want them to learn. Ready in minutes.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Link
                            href="/create"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                        >
                            Create your first story
                            <span className="text-lg"><ArrowRight /></span>
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium px-6 py-3.5 rounded-xl hover:bg-muted transition-colors text-base"
                        >
                            See how it works
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-4 text-xs text-muted-foreground"
                    >
                        Free to try · No credit card required · First story on us
                    </motion.p>
                </div>

                {/* Right — floating book */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <FloatingBook />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-muted-foreground">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-8 border border-border rounded-full flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-1.5 rounded-full bg-muted-foreground" />
                </motion.div>
            </motion.div>
        </section>
    );
}