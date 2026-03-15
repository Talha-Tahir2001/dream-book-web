"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { auth } from "@/shared/firebase";
import { StoryRequest, VoiceResultPayload } from "@/shared/types";

export type VoiceState =
    | "idle"
    | "connecting"
    | "listening"
    | "processing"
    | "done"
    | "error";

interface UseVoiceInputReturn {
    state: VoiceState;
    transcript: string;
    result: StoryRequest | null;
    error: string | null;
    start: () => Promise<void>;
    stop: () => void;
    reset: () => void;
}

// ── PCM Processor ─────────────────────────────────────────────
// Inline AudioWorklet that converts Float32 samples → Int16 PCM
const PCM_PROCESSOR_CODE = `
class PcmProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const float32 = input[0];
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    this.port.postMessage(int16.buffer, [int16.buffer]);
    return true;
  }
}
registerProcessor('pcm-processor', PcmProcessor);
`;

export function useVoiceInput(): UseVoiceInputReturn {
    const [state, setState] = useState<VoiceState>("idle");
    const [transcript, setTranscript] = useState("");
    const [result, setResult] = useState<StoryRequest | null>(null);
    const [error, setError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        return () => cleanup();
    }, []);

    const cleanup = () => {
        workletNodeRef.current?.disconnect();
        workletNodeRef.current = null;
        audioContextRef.current?.close();
        audioContextRef.current = null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        socketRef.current?.disconnect();
        socketRef.current = null;
    };

    const start = useCallback(async () => {
        try {
            setState("connecting");
            setTranscript("");
            setResult(null);
            setError(null);

            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            // ── Connect Socket.io to NestJS /voice namespace ───────
            const socket = io(
                `${process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001"}/voice`,
                { auth: { token }, transports: ["websocket"] }
            );
            socketRef.current = socket;

            socket.on("voice:transcript", ({ text }: { text: string }) => {
                setTranscript(text);
            });

            socket.on("voice:result", (payload: VoiceResultPayload) => {
                setResult(payload.storyRequest);
                setState("done");
            });

            socket.on("voice:error", ({ message }: { message: string }) => {
                setError(message);
                setState("error");
            });

            socket.on("connect_error", (err) => {
                setError(`Connection failed: ${err.message}`);
                setState("error");
            });

            // Wait for socket to connect, then start the Live session
            await new Promise<void>((resolve, reject) => {
                socket.once("connect", resolve);
                socket.once("connect_error", reject);
                setTimeout(() => reject(new Error("Socket connection timed out")), 8000);
            });

            // Tell NestJS to open a Gemini Live session
            socket.emit("voice:start");

            // ── Set up microphone → PCM AudioWorklet ───────────────
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            streamRef.current = stream;

            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            // Register inline PCM processor as a Blob URL
            const blob = new Blob([PCM_PROCESSOR_CODE], { type: "application/javascript" });
            const workletUrl = URL.createObjectURL(blob);
            await audioContext.audioWorklet.addModule(workletUrl);
            URL.revokeObjectURL(workletUrl);

            const source = audioContext.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");
            workletNodeRef.current = workletNode;

            // Accumulate PCM buffers and send in ~250ms batches
            let pcmBatch: ArrayBuffer[] = [];
            let batchSize = 0;
            const BATCH_BYTES = 16000 * 2 * 0.25; // 250ms @ 16kHz 16-bit

            workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
                if (!socket.connected) return;
                pcmBatch.push(e.data);
                batchSize += e.data.byteLength;

                if (batchSize >= BATCH_BYTES) {
                    // Merge batch into a single ArrayBuffer
                    const merged = new Uint8Array(batchSize);
                    let offset = 0;
                    for (const buf of pcmBatch) {
                        merged.set(new Uint8Array(buf), offset);
                        offset += buf.byteLength;
                    }

                    // Base64 encode and send to NestJS
                    const base64 = btoa(String.fromCharCode(...merged));
                    socket.emit("voice:audio", { audioChunk: base64 });

                    pcmBatch = [];
                    batchSize = 0;
                }
            };

            source.connect(workletNode);
            // Don't connect to destination — we only want processing, not playback
            setState("listening");
        } catch (err) {
            setError((err as Error).message);
            setState("error");
            cleanup();
        }
    }, []);

    const stop = useCallback(() => {
        // Stop mic first
        workletNodeRef.current?.disconnect();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioContextRef.current?.close();

        setState("processing");

        // Tell NestJS to close the Live session and extract StoryRequest
        if (socketRef.current?.connected) {
            socketRef.current.emit("voice:stop");
        } else {
            setError("Connection lost. Please try again.");
            setState("error");
        }
    }, []);

    const reset = useCallback(() => {
        cleanup();
        setState("idle");
        setTranscript("");
        setResult(null);
        setError(null);
    }, []);

    return { state, transcript, result, error, start, stop, reset };
}