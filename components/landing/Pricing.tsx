'use client'

import { motion } from "framer-motion";
import FadeUp from "../FadeUp";
import StaggerChildren, { StaggerItem } from "../StaggerChildren";
import Link from "next/link";

const plans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        desc: "Try DreamBook with your first story.",
        features: ["1 story per month", "8 pages per story", "4 illustration styles", "PDF export", "Audio narration"],
        cta: "Get started free",
        href: "/create",
        highlighted: false,
    },
    {
        name: "Family",
        price: "$9",
        period: "/month",
        desc: "For families who read together every night.",
        features: [
            "Unlimited stories",
            "Up to 12 pages per story",
            "All illustration styles",
            "PDF export + print quality",
            "Audio narration",
            "15 languages",
            "Story library",
        ],
        cta: "Start free trial",
        href: "/create?plan=family",
        highlighted: true,
    },
    {
        name: "Gift",
        price: "$24",
        period: " one-time",
        desc: "A single perfect storybook as a gift.",
        features: ["1 premium story", "Up to 12 pages", "All illustration styles", "Print-ready PDF", "Gift card included", "Priority generation"],
        cta: "Create a gift story",
        href: "/create?plan=gift",
        highlighted: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-32 bg-muted/20 border-y border-border">
            <div className="max-w-6xl mx-auto px-6">
                <FadeUp className="text-center mb-16">
                    <div className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">Pricing</div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Simple, honest pricing.
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Start free. No credit card required.
                    </p>
                </FadeUp>

                <StaggerChildren className="grid md:grid-cols-3 gap-6 items-stretch" stagger={0.1}>
                    {plans.map((plan) => (
                        <StaggerItem key={plan.name}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.25 }}
                                className={`relative p-7 rounded-2xl h-full flex flex-col border ${plan.highlighted
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-card border-border"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full">
                                        Most popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className={`text-sm font-medium mb-1 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                        {plan.name}
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-2 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                        {plan.desc}
                                    </p>
                                </div>

                                <ul className="space-y-2.5 flex-1 mb-7">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2.5 text-sm">
                                            <span className={`text-xs ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`}>✓</span>
                                            <span className={plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"}>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.href}
                                    className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${plan.highlighted
                                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </section>
    );
}