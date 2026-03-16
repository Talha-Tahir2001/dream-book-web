"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceInput, VoiceState } from "@/hooks/use-voice-input";
import { StoryRequest } from "@/shared/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Mic, StopCircle } from "lucide-react";

const MotionButton = motion(Button);

interface VoiceRecorderProps {
    onResult: (result: StoryRequest) => void;
}

// Animated waveform bars
function Waveform({ active }: { active: boolean }) {
    const bars = 20;
    return (
        <div className="flex items-center gap-0.5 h-10">
            {Array.from({ length: bars }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 rounded-full bg-primary"
                    animate={
                        active
                            ? {
                                height: [4, Math.random() * 28 + 8, 4],
                                opacity: [0.4, 1, 0.4],
                            }
                            : { height: 4, opacity: 0.2 }
                    }
                    transition={{
                        duration: 0.6 + Math.random() * 0.4,
                        repeat: active ? Infinity : 0,
                        delay: (i / bars) * 0.3,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

const stateMessages: Record<VoiceState, string> = {
    idle: 'Tap the mic and describe your child — "Emma, age 5, loves dinosaurs..."',
    connecting: "Connecting...",
    listening: "Listening — speak naturally, take your time",
    processing: "Processing your description...",
    done: "Got it! Review and confirm below.",
    error: "Something went wrong. Try again.",
};

export function VoiceRecorder({ onResult }: VoiceRecorderProps) {
    const { state, transcript, result, error, start, stop, reset } = useVoiceInput();

    // Auto-forward result when done
    useEffect(() => {
        if (result && state === "done") {
            onResult(result);
        }
    }, [result, state, onResult]);

    // Show error toast if voice input fails
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const isListening = state === "listening";
    const isActive = state === "listening" || state === "connecting";
    const isDone = state === "done";
    const isProcessing = state === "processing";

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
            {/* Mic button */}
            <div className="relative flex items-center justify-center">
                {/* Pulse rings when listening */}
                {isListening && (
                    <>
                        <motion.div
                            className="absolute rounded-full border-2 border-primary/30"
                            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            style={{ width: 100, height: 100 }}
                        />
                        <motion.div
                            className="absolute rounded-full border-2 border-primary/20"
                            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                            style={{ width: 100, height: 100 }}
                        />
                    </>
                )}

                <MotionButton
                    onClick={isActive ? stop : start}
                    disabled={isProcessing || isDone}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant={isActive ? "destructive" : isDone ? "secondary" : "default"}
                    size="icon-lg"
                    className={`relative w-24 h-24 rounded-full text-3xl shadow-lg ${isDone ? "bg-primary/20 text-primary cursor-default hover:bg-primary/20" : ""
                        }`}
                >
                    {isProcessing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-7 h-7 border-2 border-current border-t-transparent rounded-full"
                        />
                    ) : isDone ? (
                        <Check className="size-8" />
                    ) : isActive ? (
                        <StopCircle className="size-8" />
                    ) : (
                        <Mic className="size-8" />
                    )}
                </MotionButton>
            </div>

            {/* Waveform */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Waveform active={isListening} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status message */}
            <motion.p
                key={state}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm text-center max-w-sm leading-relaxed ${state === "error" ? "text-destructive" : "text-muted-foreground"
                    }`}
            >
                {error ?? stateMessages[state]}
            </motion.p>

            {/* Live transcript */}
            <AnimatePresence>
                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 overflow-hidden"
                    >
                        <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                            Transcript
                        </p>
                        <p className="text-sm text-foreground leading-relaxed italic">
                            "{transcript}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error reset */}
            {state === "error" && (
                <Button
                    variant="link"
                    size="sm"
                    onClick={reset}
                    className="text-muted-foreground hover:text-foreground underline decoration-muted-foreground/30 hover:decoration-foreground"
                >
                    Try again
                </Button>
            )}
        </div>
    );
}