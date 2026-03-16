"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StoryRequest, IllustrationStyle } from "@/shared/types";
import { Button } from "@/components/ui/button";

const MotionButton = motion(Button);

interface StoryConfirmFormProps {
    initial: StoryRequest;
    onConfirm: (request: StoryRequest) => void;
    onBack: () => void;
    loading?: boolean;
}

const STYLES: { value: IllustrationStyle; label: string; emoji: string }[] = [
    { value: "watercolor", label: "Watercolor", emoji: "🎨" },
    { value: "cartoon", label: "Cartoon", emoji: "✏️" },
    { value: "pencil-sketch", label: "Pencil Sketch", emoji: "🖋️" },
    { value: "digital-art", label: "Digital Art", emoji: "💻" },
];

const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ar", label: "Arabic" },
    { value: "ur", label: "Urdu" },
    { value: "hi", label: "Hindi" },
    { value: "pt", label: "Portuguese" },
    { value: "it", label: "Italian" },
    { value: "ja", label: "Japanese" },
];

export function StoryConfirmForm({
    initial,
    onConfirm,
    onBack,
    loading = false,
}: StoryConfirmFormProps) {
    const [form, setForm] = useState<StoryRequest>(initial);
    const [interestInput, setInterestInput] = useState("");

    const update = <K extends keyof StoryRequest>(key: K, value: StoryRequest[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const addInterest = () => {
        const trimmed = interestInput.trim();
        if (!trimmed || form.interests.length >= 5) return;
        update("interests", [...form.interests, trimmed]);
        setInterestInput("");
    };

    const removeInterest = (i: number) => {
        update("interests", form.interests.filter((_, idx) => idx !== i));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(form);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="text-4xl mb-3">✨</div>
                <h2 className="text-2xl font-bold mb-1">Review your story details</h2>
                <p className="text-sm text-muted-foreground">
                    We extracted these from what you said. Adjust anything before generating.
                </p>
            </div>

            {/* Child name + age row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                        Child's name
                    </label>
                    <input
                        type="text"
                        value={form.childName}
                        onChange={(e) => update("childName", e.target.value)}
                        required
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="Emma"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                        Age
                    </label>
                    <input
                        type="number"
                        value={form.childAge}
                        onChange={(e) => update("childAge", parseInt(e.target.value))}
                        min={1}
                        max={12}
                        required
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Interests */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                    Interests <span className="normal-case">(up to 5)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {form.interests.map((interest, i) => (
                        <motion.span
                            key={interest}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20"
                        >
                            {interest}
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                type="button"
                                onClick={() => removeInterest(i)}
                                className="h-4 w-4 rounded-full p-0 flex items-center justify-center hover:bg-primary/20 hover:text-destructive"
                            >
                                ×
                            </Button>
                        </motion.span>
                    ))}
                </div>
                {form.interests.length < 5 && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                            placeholder="Add an interest..."
                            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        <Button
                            type="button"
                            onClick={addInterest}
                            variant="secondary"
                            className="px-4 h-auto py-2.5 rounded-xl border border-border"
                        >
                            Add
                        </Button>
                    </div>
                )}
            </div>

            {/* Lesson */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                    Lesson to teach{" "}
                    <span className="normal-case font-normal">(optional)</span>
                </label>
                {/* <input
          type="text"
          value={form.lesson ?? ""}
          onChange={(e) => update("lesson", e.target.value || undefined)}
          placeholder='e.g. "Being brave means doing it even when you\'re scared"'
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        /> */}
            </div>

            {/* Page count */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">
                    Story length
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min={4}
                        max={12}
                        step={2}
                        value={form.pageCount}
                        onChange={(e) => update("pageCount", parseInt(e.target.value))}
                        className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-medium w-16 text-right">
                        {form.pageCount} pages
                    </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Short (4)</span>
                    <span>Long (12)</span>
                </div>
            </div>

            {/* Illustration style */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">
                    Illustration style
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {STYLES.map((style) => (
                        <Button
                            key={style.value}
                            type="button"
                            variant={form.illustrationStyle === style.value ? "secondary" : "outline"}
                            onClick={() => update("illustrationStyle", style.value)}
                            className={`p-3 h-auto min-h-22 flex flex-col items-center justify-center rounded-xl border text-center transition-all ${
                                form.illustrationStyle === style.value
                                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
                                    : "bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted"
                            }`}
                        >
                            <div className="text-xl mb-1">{style.emoji}</div>
                            <div className="text-xs font-medium">{style.label}</div>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Language */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                    Language
                </label>
                <select
                    value={form.language}
                    onChange={(e) => update("language", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={loading}
                    className="flex-1 h-auto py-3.5 border border-border rounded-xl text-sm font-medium"
                >
                    ← Re-record
                </Button>
                <MotionButton
                    type="submit"
                    disabled={loading || form.interests.length === 0}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    variant="default"
                    className="flex-2 h-auto py-3.5 rounded-xl text-sm font-semibold"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                            />
                            Creating your story...
                        </div>
                    ) : (
                        <>Generate {form.childName}'s story →</>
                    )}
                </MotionButton>
            </div>
        </motion.form>
    );
}