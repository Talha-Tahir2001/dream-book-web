"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MotionButton = motion(Button);

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    // Already logged in → redirect
    useEffect(() => {
        if (!loading && user) router.replace("/library");
    }, [user, loading, router]);

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            router.replace("/library");
        } catch (err) {
            console.error("Sign in failed:", err);
            toast.error((err as Error).message || "Sign in failed");
        }
    };

    if (loading) return null;

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6">
            {/* Background dot grid */}
            <div
                className="fixed inset-0 opacity-30"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative bg-card border border-border rounded-3xl p-10 w-full max-w-md text-center shadow-xl"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6"
                >
                    ✦
                </motion.div>

                <h1 className="text-3xl font-bold mb-2">Welcome to DreamBook</h1>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                    Sign in to create personalized storybooks for your child — illustrated,
                    narrated, and ready in minutes.
                </p>

                {/* Google Sign In */}
                <MotionButton
                    onClick={handleSignIn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 font-semibold py-3.5 px-6 h-auto rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors border-none"
                >
                    {/* Google logo SVG */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </MotionButton>

                <p className="text-xs text-muted-foreground mt-6">
                    By signing in you agree to our{" "}
                    <a href="/terms" className="underline hover:text-foreground">Terms</a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
                </p>
            </motion.div>
        </main>
    );
}