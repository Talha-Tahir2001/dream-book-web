'use client'
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function StaggerChildren({
    children,
    className = "",
    stagger = 0.1,
}: {
    children: React.ReactNode;
    className?: string;
    stagger?: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
                visible: { transition: { staggerChildren: stagger } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}