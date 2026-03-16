"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/auth/auth-guard";

import { VoiceRecorder } from "@/components/story/voice-recorder";
import { StoryConfirmForm } from "@/components/story/story-confirm-form";
import { createStory } from "@/shared/api";
import { StoryRequest } from "@/shared/types";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Step = "voice" | "confirm" | "creating";

export default function CreatePage() {
    const [step, setStep] = useState<Step>("voice");
    const [extracted, setExtracted] = useState<StoryRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Voice result received → move to confirm step
    const handleVoiceResult = useCallback((result: StoryRequest) => {
        setExtracted(result);
        setStep("confirm");
    }, []);

    // User confirmed → POST to API → redirect to streaming viewer
    const handleConfirm = async (request: StoryRequest) => {
        setLoading(true);
        setError(null);
        toast.info("Generating your story...", { duration: 5000 });
        try {
            const { storyId } = await createStory(request);
            toast.success("Story creation started!");
            router.push(`/book/${storyId}`);
        } catch (err) {
            const msg = (err as Error).message;
            setError(msg);
            toast.error(msg);
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background pt-16">
                <Navbar />

                <main className="max-w-3xl mx-auto px-6 py-16">
                    {/* Page header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-14"
                    >
                        <h1 className="text-4xl font-bold mb-3">Create a story</h1>
                        <p className="text-muted-foreground">
                            Describe your child with your voice — we'll do the rest.
                        </p>
                    </motion.div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mb-14">
                        {(["voice", "confirm"] as const).map((s, i) => (
                            <div key={s} className="flex items-center gap-3">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === s
                                            ? "bg-primary text-primary-foreground scale-110"
                                            : step === "confirm" && s === "voice"
                                                ? "bg-primary/20 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {step === "confirm" && s === "voice" ? "✓" : i + 1}
                                </div>
                                <span
                                    className={`text-xs font-medium transition-colors ${step === s ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {s === "voice" ? "Describe" : "Confirm"}
                                </span>
                                {i < 1 && <div className="w-12 h-px bg-border" />}
                            </div>
                        ))}
                    </div>

                    {/* Step content */}
                    <AnimatePresence mode="wait">
                        {step === "voice" && (
                            <motion.div
                                key="voice"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <VoiceRecorder onResult={handleVoiceResult} />

                                {/* Divider + manual fallback */}
                                <div className="flex items-center gap-4 my-10">
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="text-xs text-muted-foreground">or</span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>

                                <p className="text-center text-sm text-muted-foreground">
                                    Prefer to type?{" "}
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() =>
                                            handleVoiceResult({
                                                childName: "",
                                                childAge: 5,
                                                interests: [],
                                                pageCount: 8,
                                                illustrationStyle: "watercolor",
                                                language: "en",
                                            })
                                        }
                                        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors p-0 h-auto font-medium"
                                    >
                                        Fill in the form manually
                                    </Button>
                                </p>
                            </motion.div>
                        )}

                        {step === "confirm" && extracted && (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {error && (
                                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive text-center">
                                        {error}
                                    </div>
                                )}
                                <StoryConfirmForm
                                    initial={extracted}
                                    onConfirm={handleConfirm}
                                    onBack={() => setStep("voice")}
                                    loading={loading}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </AuthGuard>
    );
}