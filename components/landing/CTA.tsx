'use client'


import Link from "next/link";
import FadeUp from "../FadeUp";

export default function CTA() {
    return (
        <section className="py-24 px-6">
            <FadeUp>
                <div className="max-w-4xl mx-auto text-center bg-primary rounded-3xl px-8 py-20 relative overflow-hidden">
                    {/* Background dots */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1.5px, transparent 0)`,
                            backgroundSize: "28px 28px",
                        }}
                    />

                    <div className="relative">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 tracking-tight">
                            Every child deserves
                            <br />
                            their own story.
                        </h2>
                        <p className="text-primary-foreground/75 text-lg mb-8 max-w-lg mx-auto">
                            Create your first personalized storybook in minutes. Free, forever.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 bg-primary-foreground text-black font-bold px-8 py-4 rounded-xl hover:bg-primary-foreground/90 transition-all hover:scale-[1.03] active:scale-[0.98] "
                        >
                            Create your child's story
                            <span className="text-lg">→</span>
                        </Link>
                        <p className="text-primary-foreground text-xs mt-4">
                            No account needed to try · Takes less than 2 minutes
                        </p>
                    </div>
                </div>
            </FadeUp>
        </section>
    );
}