"use client";

import { useState, useCallback, useRef } from "react";
import { streamStory, getStory } from "@/shared/api";
import {
    StoryPage,
    Story,
    PageTextPayload,
    PageImagePayload,
    PageAudioPayload,
    StoryCompletePayload,
    StoryErrorPayload,
} from "@/shared/types";

export type StreamStatus =
    | "idle"
    | "streaming"
    | "illustrating"
    | "complete"
    | "error";

interface UseStoryStreamReturn {
    pages: StoryPage[];
    status: StreamStatus;
    error: string | null;
    pdfUrl: string | null;
    startStream: (storyId: string) => Promise<void>;
    reset: () => void;
}

export function useStoryStream(): UseStoryStreamReturn {
    const [pages, setPages] = useState<StoryPage[]>([]);
    const [status, setStatus] = useState<StreamStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const abortRef = useRef(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const reset = useCallback(() => {
        abortRef.current = true;
        if (pollRef.current) clearInterval(pollRef.current);
        setPages([]);
        setStatus("idle");
        setError(null);
        setPdfUrl(null);
        setTimeout(() => { abortRef.current = false; }, 100);
    }, []);

    // ── Upsert a page in state ──────────────────────────────────
    const upsertPage = useCallback(
        (update: Partial<StoryPage> & { pageNumber: number }) => {
            setPages((prev) => {
                const idx = prev.findIndex((p) => p.pageNumber === update.pageNumber);
                if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = { ...next[idx], ...update };
                    return next;
                }
                return [
                    ...prev,
                    { text: "", imagePrompt: "", ...update },
                ].sort((a, b) => a.pageNumber - b.pageNumber);
            });
        },
        []
    );

    // ── Poll Firestore (via API) for illustration + PDF updates ──
    // Cloud Tasks generates illustrations async after the SSE stream
    // ends. We poll the story endpoint until all images are filled in.
    const startPolling = useCallback((storyId: string) => {
        if (pollRef.current) clearInterval(pollRef.current);

        let attempts = 0;
        const MAX_ATTEMPTS = 40; // 40 × 5s = 3.5 min max

        pollRef.current = setInterval(async () => {
            if (abortRef.current) {
                clearInterval(pollRef.current!);
                return;
            }

            attempts++;
            if (attempts > MAX_ATTEMPTS) {
                clearInterval(pollRef.current!);
                return;
            }

            try {
                const story: Story = await getStory(storyId);

                // Update pages with any newly arrived image URLs
                story.pages.forEach((page) => {
                    if (page.imageUrl) {
                        upsertPage({ pageNumber: page.pageNumber, imageUrl: page.imageUrl });
                    }
                    if (page.audioUrl) {
                        upsertPage({ pageNumber: page.pageNumber, audioUrl: page.audioUrl });
                    }
                });

                // Update PDF url when ready
                if (story.pdfUrl) {
                    setPdfUrl(story.pdfUrl);
                }

                // Stop polling once all images are present
                const allIllustrated = story.pages.length > 0 &&
                    story.pages.every((p) => p.imageUrl);

                if (allIllustrated) {
                    setStatus("complete");
                    clearInterval(pollRef.current!);
                }
            } catch (err) {
                // Silently continue polling on transient errors
                console.warn("Poll error:", err);
            }
        }, 5000); // poll every 5 seconds
    }, [upsertPage]);

    // ── Main stream handler ─────────────────────────────────────
    const startStream = useCallback(
        async (storyId: string) => {
            abortRef.current = false;
            setPages([]);
            setStatus("streaming");
            setError(null);
            setPdfUrl(null);

            try {
                for await (const { event, data } of streamStory(storyId)) {
                    if (abortRef.current) break;

                    switch (event) {
                        case "page:text": {
                            const p = data as PageTextPayload;
                            upsertPage({ pageNumber: p.pageNumber, text: p.text });
                            break;
                        }

                        case "page:image": {
                            // This event carries imagePrompt, not the final URL.
                            // The actual imageUrl arrives asynchronously via Cloud Tasks.
                            // We store the prompt and wait for polling to fill in the URL.
                            const p = data as PageImagePayload;
                            // imageUrl field may be present if backend sends it directly
                            if (p.imageUrl) {
                                upsertPage({ pageNumber: p.pageNumber, imageUrl: p.imageUrl });
                            }
                            break;
                        }

                        case "page:audio": {
                            const p = data as PageAudioPayload;
                            upsertPage({ pageNumber: p.pageNumber, audioUrl: p.audioUrl });
                            break;
                        }

                        case "story:complete": {
                            const p = data as StoryCompletePayload;
                            if (p.pdfUrl) setPdfUrl(p.pdfUrl);
                            // pdfUrl present = illustrations done (local dev direct mode)
                            // pdfUrl absent  = illustrations still generating via Cloud Tasks
                            if (p.pdfUrl) {
                                setStatus("complete");
                            } else {
                                setStatus("illustrating");
                                startPolling(storyId);
                            }
                            break;
                        }

                        case "story:error": {
                            const p = data as StoryErrorPayload;
                            setError(p.message);
                            setStatus("error");
                            break;
                        }
                    }
                }
            } catch (err) {
                if (!abortRef.current) {
                    setError((err as Error).message);
                    setStatus("error");
                }
            }
        },
        [upsertPage, startPolling]
    );

    return { pages, status, error, pdfUrl, startStream, reset };
}