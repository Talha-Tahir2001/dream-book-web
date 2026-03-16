"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/auth/auth-guard";

import { listStories, deleteStory } from "@/shared/api";
import { Story, StoryStatus } from "@/shared/types";
import { useAuth } from "@/components/auth/auth-provider";
import Navbar from "@/components/landing/Navbar";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Plus, Sparkles, Trash } from "lucide-react";

function StatusBadge({ status }: { status: StoryStatus }) {
    const config: Record<StoryStatus, { label: string; className: string }> = {
        pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
        generating: { label: "Generating...", className: "bg-primary/10 text-primary" },
        illustrating: { label: "Illustrating...", className: "bg-primary/10 text-primary" },
        complete: { label: "Ready", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
        error: { label: "Error", className: "bg-destructive/10 text-destructive" },
    };
    const { label, className } = config[status];
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
            {label}
        </span>
    );
}

function StoryCard({ story, onDelete }: { story: Story; onDelete: (id: string) => void }) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteStory(story.id);
            onDelete(story.id);
            toast.success("Story deleted");
        } catch (err) {
            setDeleting(false);
            toast.error("Failed to delete story");
            console.error(err);
        }
    };

    const coverImage = story.pages.find((p) => p.imageUrl)?.imageUrl;
    const date = new Date(story.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/book/${story.id}`)}
        >
            <div className="4/3 bg-muted/30 overflow-hidden">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt="Story cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        {story.status === "complete" ? <BookOpen className="w-10 h-10 text-primary" /> : <Sparkles className="w-10 h-10 text-primary" />}
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm leading-snug">
                            {story.request.childName}'s Story
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={story.status} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="icon-xs"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={deleting}
                                    className="h-7 w-7 cursor-pointer transition-colors"
                                >
                                    {deleting ? "..." : <Trash className="size-3.5" />}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete story?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete {story.request.childName}'s story. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        variant="destructive"
                                        className="cursor-pointer"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                    {story.request.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            {interest}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">{date}</div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{story.pages.length} pages</span>
                        {story.pdfUrl && (
                            <Button asChild variant='default'>
                                <Link href={story.pdfUrl} target="_blank" rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-primary">
                                    <Download /> PDF
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

        </motion.div>
    );
}

export default function LibraryPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Wait for Firebase to resolve auth state before making any API calls
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading || !user) return;

        setLoading(true);
        setError(null);

        listStories()
            .then(({ stories }) => setStories(stories))
            .catch((err) => {
                const msg = err.message || "Failed to load stories";
                setError(msg);
                toast.error(msg);
            })
            .finally(() => setLoading(false));
    }, [user, authLoading]);

    const isLoading = loading || authLoading;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background pt-16">
                <Navbar />
                <main className="max-w-6xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end justify-between mb-10"
                    >
                        <div>
                            <h1 className="text-4xl font-bold mb-1">My Stories</h1>
                            <p className="text-muted-foreground text-sm">
                                {stories.length > 0
                                    ? `${stories.length} stor${stories.length === 1 ? "y" : "ies"} created`
                                    : "Your personalized storybooks live here"}
                            </p>
                        </div>
                        <Link href="/create">
                            <Button variant="default" className="cursor-pointer"
                            // className="inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-xl text-sm"
                            >
                                <Plus /> New story
                            </Button>
                        </Link>
                    </motion.div>

                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-muted/30 rounded-2xl aspect-3/4 animate-pulse"
                                    style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="text-center py-20">
                            <p className="text-destructive text-sm mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-sm text-primary underline">
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && stories.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-28">
                            <div className="text-7xl mb-6">📖</div>
                            <h2 className="text-2xl font-bold mb-3">No stories yet</h2>
                            <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                                Create your first personalized storybook — it only takes 2 minutes.
                            </p>
                            <Link href="/create">
                                <Button
                                    className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl h-auto"
                                >
                                    Create my child's first story →
                                </Button>
                            </Link>
                        </motion.div>
                    )}

                    {!isLoading && !error && stories.length > 0 && (
                        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            <AnimatePresence mode="popLayout">
                                {stories.map((story) => (
                                    <StoryCard key={story.id} story={story}
                                        onDelete={(id) => setStories((prev) => prev.filter((s) => s.id !== id))} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </main>
            </div>
        </AuthGuard>
    );
}