export type IllustrationStyle = "watercolor" | "cartoon" | "pencil-sketch" | "digital-art";

export interface StoryRequest {
    childName: string;
    childAge: number;
    interests: string[];
    lesson?: string;
    fears?: string[];
    pageCount: number;
    illustrationStyle: IllustrationStyle;
    language: string;
}

export type StoryStatus = "pending" | "generating" | "illustrating" | "complete" | "error";

export interface StoryPage {
    pageNumber: number;
    text: string;
    imagePrompt: string;
    imageUrl?: string;
    audioUrl?: string;
}

export interface Story {
    id: string;
    userId: string;
    request: StoryRequest;
    status: StoryStatus;
    pages: StoryPage[];
    pdfUrl?: string;
    createdAt: number;
    updatedAt: number;
}

// ── SSE event types ───────────────────────────────────────────
export type SseEventType =
    | "story:start"
    | "page:text"
    | "page:image"
    | "page:audio"
    | "story:complete"
    | "story:error";

export interface PageTextPayload {
    storyId: string;
    pageNumber: number;
    text: string;
}

export interface PageImagePayload {
    storyId: string;
    pageNumber: number;
    imageUrl: string;
}

export interface PageAudioPayload {
    storyId: string;
    pageNumber: number;
    audioUrl: string;
}

export interface StoryCompletePayload {
    storyId: string;
    pageCount: number;
    pdfUrl?: string;
}

export interface StoryErrorPayload {
    storyId: string;
    message: string;
}

// ── WebSocket voice event types ───────────────────────────────
export interface VoiceTranscriptPayload {
    sessionId: string;
    text: string;
    isFinal: boolean;
}

export interface VoiceResultPayload {
    sessionId: string;
    storyRequest: StoryRequest;
}