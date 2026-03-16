"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/auth/auth-guard";

import { useStoryStream } from "@/hooks/use-story-stream";
import { getStory } from "@/shared/api";
import { Story, StoryPage } from "@/shared/types";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, PartyPopper, Pause, Play } from "lucide-react";
import Link from "next/link";

// ── Status banner shown during generation ────────────────────
function StatusBanner({
    status,
    pageCount,
    targetCount,
}: {
    status: string;
    pageCount: number;
    targetCount: number;
}) {
    const messages: Record<string, string> = {
        streaming: "Writing your story...",
        illustrating: "Creating illustrations...",
        complete: "Your story is ready!",
        error: "Something went wrong",
    };

    const progress = targetCount > 0 ? (pageCount / targetCount) * 100 : 0;

    if (status === "complete") return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary/5 border-b border-primary/20 px-6 py-3"
        >
            <div className="max-w-6xl mx-auto flex items-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full shrink-0"
                />
                <span className="text-sm text-primary font-medium">
                    {messages[status] ?? "Generating..."}
                </span>
                {targetCount > 0 && (
                    <div className="flex-1 bg-primary/10 rounded-full h-1.5 max-w-xs">
                        <motion.div
                            className="bg-primary h-full rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                )}
                {targetCount > 0 && (
                    <span className="text-xs text-muted-foreground shrink-0">
                        {pageCount} / {targetCount} pages
                    </span>
                )}
            </div>
        </motion.div>
    );
}

// ── Audio player for a page ───────────────────────────────────
function AudioPlayer({ audioUrl }: { audioUrl: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioError, setAudioError] = useState<string | null>(null);

    const toggle = async () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
            toast.warning("Audio paused");
        } else {
            try {
                audioRef.current.load();
                await audioRef.current.play();
                setPlaying(true);
                setAudioError(null);
            } catch (err) {
                setAudioError("Audio unavailable");
                setPlaying(false);
                console.warn("Audio play failed:", (err as Error).message);
            }
        }
    };

    if (audioError) {
        return (
            <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border text-xs text-muted-foreground">
                Narration unavailable
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 mt-4 p-3 bg-muted/50 rounded-xl border border-border">
            <audio
                ref={audioRef}
                src={audioUrl}
                preload="none"
                onEnded={() => { setPlaying(false); setProgress(0); }}
                onError={() => setAudioError("Audio unavailable")}
                onTimeUpdate={() => {
                    if (audioRef.current && audioRef.current.duration) {
                        setProgress(
                            (audioRef.current.currentTime / audioRef.current.duration) * 100
                        );
                    }
                }}
            />
            <Button variant='default'
                onClick={toggle} className="cursor-pointer"
            // className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0 hover:bg-primary/90 transition-colors"
            >
                {playing ? <Pause /> : <Play />}
            </Button>
            <div className="flex-1 bg-border rounded-full h-1">
                <div
                    className="bg-primary h-full rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">Narration</span>
        </div>
    );
}

// ── Single page card — split view ─────────────────────────────
function BookCard({
    page,
    index,
}: {
    page: StoryPage;
    index: number;
}) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
        >
            <div className={`grid md:grid-cols-2 ${isEven ? "" : "md:[direction:rtl]"}`}>
                {/* Illustration side */}
                <div className="md:[direction:ltr] relative aspect-square md:aspect-auto bg-muted/30 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {page.imageUrl ? (
                            <motion.img
                                key="image"
                                src={page.imageUrl}
                                alt={`Page ${page.pageNumber} illustration`}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <motion.div
                                key="placeholder"
                                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Illustrating page {page.pageNumber}...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Page number badge */}
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-xs font-bold">
                        {page.pageNumber}
                    </div>
                </div>

                {/* Text side */}
                <div className="md:[direction:ltr] p-8 md:p-10 flex flex-col justify-center">
                    <AnimatePresence>
                        {page.text ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-lg md:text-xl leading-relaxed text-foreground font-serif">
                                    {page.text}
                                </p>

                                {page.audioUrl && (
                                    <AudioPlayer audioUrl={page.audioUrl} />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {[80, 95, 70, 85].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-4 bg-muted rounded-full animate-pulse"
                                        style={{ width: `${w}%` }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

// ── Main page ─────────────────────────────────────────────────
export default function BookPage() {
    const params = useParams();
    const storyId = params.id as string;
    const router = useRouter();

    const { pages, status, error, pdfUrl, startStream, reset } = useStoryStream();
    const [story, setStory] = useState<Story | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    // Use a ref instead of state to prevent StrictMode double-firing
    const hasStarted = useRef(false);

    // Load story metadata + start stream
    useEffect(() => {
        if (!storyId || hasStarted.current) return;
        hasStarted.current = true;

        const init = async () => {
            try {
                const data = await getStory(storyId);
                setStory(data);

                // Already complete — just show saved pages, no need to stream
                if (data.status === "complete" && data.pages.length > 0) {
                    return;
                }

                await startStream(storyId);
            } catch (err) {
                console.error("Failed to load story:", err);
                toast.error("Failed to load story");
            }
        };

        init();

        return () => {
            // Only reset on true unmount, not StrictMode remount
        };
    }, [storyId]);

    // Auto-scroll as new pages arrive
    useEffect(() => {
        if (pages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [pages.length]);

    // Use streamed pages if available, else story.pages from Firestore
    const displayPages =
        pages.length > 0 ? pages : story?.pages ?? [];

    const targetCount = story?.request.pageCount ?? 8;
    const isComplete = status === "complete" || story?.status === "complete";
    const hasError = status === "error";

    // Toast on completion
    useEffect(() => {
        if (isComplete) {
            toast.success("Your story is ready!", {
                description: `${story?.request.childName}'s story is complete`,
                id: "story-complete", // Prevent duplicates
            });
        }
    }, [isComplete, story?.request.childName]);

    // Toast on error
    useEffect(() => {
        if (hasError && error) {
            toast.error("Generation failed", {
                description: error,
            });
        }
    }, [hasError, error]);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background pt-16">
                <Navbar />

                {/* Status banner */}
                <AnimatePresence>
                    {!isComplete && !hasError && (
                        <StatusBanner
                            status={status}
                            pageCount={displayPages.length}
                            targetCount={targetCount}
                        />
                    )}
                </AnimatePresence>

                <main className="max-w-5xl mx-auto px-6 py-12">
                    {/* Story header */}
                    {story && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-full px-4 py-1.5 mb-4">
                                <span>{story.request.illustrationStyle}</span>
                                <span>·</span>
                                <span>{story.request.pageCount} pages</span>
                                <span>·</span>
                                <span>{story.request.language.toUpperCase()}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {story.request.childName}'s Story
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {story.request.interests.join(" · ")}
                            </p>
                        </motion.div>
                    )}

                    {/* Error state */}
                    {hasError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="text-5xl mb-4">😔</div>
                            <h2 className="text-xl font-bold mb-2">Story generation failed</h2>
                            <p className="text-sm text-muted-foreground mb-6">{error}</p>
                            <Button
                                onClick={() => router.push("/create")}
                                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Try again
                            </Button>
                        </motion.div>
                    )}

                    {/* Pages */}
                    <div className="space-y-8">
                        {displayPages.map((page, i) => (
                            <BookCard key={page.pageNumber} page={page} index={i} />
                        ))}
                    </div>

                    {/* Skeleton for upcoming pages */}
                    {!isComplete && !hasError && displayPages.length < targetCount && (
                        <div className="space-y-8 mt-8">
                            {Array.from({
                                length: Math.max(0, Math.min(2, targetCount - displayPages.length)),
                            }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-muted/20 border border-border rounded-3xl h-64 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Completion footer */}
                    <AnimatePresence>
                        {isComplete && displayPages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mt-16 text-center"
                            >
                                <div className="inline-block bg-card border border-border rounded-3xl px-10 py-10">
                                    <div className="text-5xl mb-4 flex justify-center items-center"><PartyPopper className="text-primary text-5xl" /></div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {story?.request.childName}'s story is ready!
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
                                        {displayPages.length} pages of magic, just for them.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        {pdfUrl && (
                                            <Link
                                                href={pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
                                            >
                                                <Download /> Download PDF
                                            </Link>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push("/library")}
                                            className="inline-flex items-center gap-2 px-6 cursor-pointer h-auto py-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium"
                                        >
                                            Go to my library
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push("/create")}
                                            className="inline-flex items-center gap-2 px-6 h-auto py-3 cursor-pointer rounded-xl hover:bg-muted transition-colors text-sm font-medium"
                                        >
                                            Create another
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={bottomRef} />
                </main>
            </div>
        </AuthGuard>
    );
}