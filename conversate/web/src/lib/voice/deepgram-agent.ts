/**
 * Deepgram Voice Agent WebSocket scaffold (experimental).
 * Full duplex voice without D-ID — requires DEEPGRAM_API_KEY server-side.
 */

export const DEEPGRAM_AGENT_WS =
  "wss://agent.deepgram.com/v1/agent/converse";

export type DeepgramAgentPhase =
  | "idle"
  | "connecting"
  | "connected"
  | "error";

export type DeepgramAgentHandlers = {
  onPhase?: (phase: DeepgramAgentPhase) => void;
  onTranscript?: (text: string, role: "user" | "agent") => void;
  onError?: (message: string) => void;
};

export function buildAgentSettingsMessage(agentConfig: unknown): string {
  return JSON.stringify(agentConfig);
}

export class DeepgramAgentSession {
  private socket: WebSocket | null = null;

  constructor(private readonly handlers: DeepgramAgentHandlers = {}) {}

  connect(token: string, agentConfig: unknown): void {
    this.handlers.onPhase?.("connecting");
    const ws = new WebSocket(DEEPGRAM_AGENT_WS, ["token", token]);
    this.socket = ws;

    ws.onopen = () => {
      ws.send(buildAgentSettingsMessage(agentConfig));
      this.handlers.onPhase?.("connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(String(event.data)) as {
          type?: string;
          role?: string;
          content?: string;
          transcript?: string;
        };
        if (data.type === "Transcript" && data.transcript) {
          const role = data.role === "assistant" ? "agent" : "user";
          this.handlers.onTranscript?.(data.transcript, role);
        }
      } catch {
        /* ignore non-json frames */
      }
    };

    ws.onerror = () => {
      this.handlers.onPhase?.("error");
      this.handlers.onError?.("Deepgram agent connection failed");
    };

    ws.onclose = () => {
      this.handlers.onPhase?.("idle");
      this.socket = null;
    };
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.handlers.onPhase?.("idle");
  }
}
