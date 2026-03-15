'use client'

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-10 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                                ✦
                            </div>
                            <span className="font-bold">DreamBook</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Personalized AI storybooks for every child. Powered by Gemini & Google Cloud.
                        </p>
                    </div>

                    {[
                        {
                            title: "Product",
                            links: ["Features", "How it works", "Pricing", "Changelog"],
                        },
                        {
                            title: "Company",
                            links: ["About", "Blog", "Press", "Careers"],
                        },
                        {
                            title: "Legal",
                            links: ["Privacy", "Terms", "Cookie policy", "Contact"],
                        },
                    ].map((col) => (
                        <div key={col.title}>
                            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                {col.title}
                            </div>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} DreamBook. Built for the Gemini Live Agent Hackathon.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Powered by Gemini 2.0 Flash · Imagen 3 · Google Cloud Run
                    </p>
                </div>
            </div>
        </footer>
    );
}