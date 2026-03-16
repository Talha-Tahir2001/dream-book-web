import { auth } from "./firebase";
import { Story, StoryRequest } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

// ── Wait for Firebase auth to initialise ─────────────────────
// auth.currentUser is null on first render even when the user IS
// logged in — Firebase needs a tick to restore the persisted session.
// This waits for the first onAuthStateChanged emission before proceeding.
function waitForAuth(): Promise<import("firebase/auth").User> {
    return new Promise((resolve, reject) => {
        if (auth.currentUser) {
            resolve(auth.currentUser);
            return;
        }
        const unsub = auth.onAuthStateChanged((user) => {
            unsub();
            if (user) resolve(user);
            else reject(new Error("Not authenticated"));
        });
        // Safety timeout
        setTimeout(() => { unsub(); reject(new Error("Auth timeout — please refresh")); }, 10_000);
    });
}


// ── Get a fresh Firebase ID token ────────────────────────────
async function getToken(): Promise<string> {
    const user = await waitForAuth();
    // if (!user) throw new Error("Not authenticated");
    return user.getIdToken(false);
}

// ── Base fetch wrapper ────────────────────────────────────────
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getToken();

    const res = await fetch(`${BASE}/api${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(body.message ?? `API error ${res.status}`);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────
//  Stories
// ─────────────────────────────────────────────────────────────

/** Create a story record — returns the storyId */
export async function createStory(
    request: StoryRequest
): Promise<{ storyId: string }> {
    return apiFetch("/stories", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

/** Fetch a single story by ID */
export async function getStory(storyId: string): Promise<Story> {
    return apiFetch(`/stories/${storyId}`);
}

/** Fetch all stories for the current user */
export async function listStories(): Promise<{ stories: Story[] }> {
    return apiFetch("/stories");
}

/** Delete a story */
export async function deleteStory(storyId: string): Promise<void> {
    return apiFetch(`/stories/${storyId}`, { method: "DELETE" });
}

// ─────────────────────────────────────────────────────────────
//  SSE stream — returns an EventSource-like async iterator
//  Usage:
//    for await (const event of streamStory(storyId)) { ... }
// ─────────────────────────────────────────────────────────────
export async function* streamStory(storyId: string) {
    const token = await getToken();

    // Use fetch + ReadableStream for auth header support
    // (native EventSource doesn't support custom headers)
    const res = await fetch(`${BASE}/api/stories/${storyId}/stream`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok || !res.body) {
        throw new Error(`Stream failed: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE format: "event: <type>\ndata: <json>\n\n"
        const messages = buffer.split("\n\n");
        buffer = messages.pop() ?? "";

        for (const msg of messages) {
            if (!msg.trim() || msg.startsWith(": ping")) continue;

            const lines = msg.split("\n");
            const eventLine = lines.find((l) => l.startsWith("event:"));
            const dataLine = lines.find((l) => l.startsWith("data:"));

            if (!eventLine || !dataLine) continue;

            const event = eventLine.replace("event:", "").trim();
            const data = JSON.parse(dataLine.replace("data:", "").trim());

            yield { event, data };
        }
    }
}

export const API_BASE = BASE;