'use client'
import { motion } from "framer-motion";

export default function FloatingBook() {
    return (
        <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
        >
            <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto drop-shadow-2xl">
                {/* Book shadow */}
                <ellipse cx="160" cy="228" rx="90" ry="8" fill="currentColor" className="text-primary/20" />

                {/* Book cover — left page */}
                <rect x="60" y="30" width="95" height="185" rx="4" fill="currentColor" className="text-primary" />
                <rect x="64" y="34" width="87" height="177" rx="2" fill="currentColor" className="text-primary-foreground/10" />

                {/* Book cover — right page */}
                <rect x="165" y="30" width="95" height="185" rx="4" fill="currentColor" className="text-primary/80" />
                <rect x="169" y="34" width="87" height="177" rx="2" fill="currentColor" className="text-primary-foreground/10" />

                {/* Spine */}
                <rect x="155" y="30" width="10" height="185" fill="currentColor" className="text-primary-foreground/30" />

                {/* Left page — illustration placeholder lines */}
                <rect x="72" y="50" width="71" height="52" rx="3" fill="currentColor" className="text-primary-foreground/20" />
                <rect x="72" y="112" width="71" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="72" y="124" width="55" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="72" y="136" width="63" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="72" y="148" width="48" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />

                {/* Right page — text lines */}
                <rect x="177" y="50" width="71" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="177" y="62" width="63" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="177" y="74" width="71" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="177" y="86" width="55" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="177" y="112" width="71" height="52" rx="3" fill="currentColor" className="text-primary-foreground/20" />
                <rect x="177" y="172" width="55" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />
                <rect x="177" y="184" width="63" height="6" rx="2" fill="currentColor" className="text-primary-foreground/30" />

                {/* Stars floating */}
                <motion.g animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}>
                    <polygon points="48,60 51,70 61,70 53,76 56,86 48,80 40,86 43,76 35,70 45,70" fill="currentColor" className="text-primary" />
                </motion.g>
                <motion.g animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
                    <polygon points="278,45 280,51 286,51 281,55 283,61 278,57 273,61 275,55 270,51 276,51" fill="currentColor" className="text-primary/70" />
                </motion.g>
                <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}>
                    <circle cx="295" cy="100" r="4" fill="currentColor" className="text-primary/60" />
                </motion.g>
                <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}>
                    <circle cx="32" cy="130" r="3" fill="currentColor" className="text-primary/50" />
                </motion.g>
            </svg>
        </motion.div>
    );
}