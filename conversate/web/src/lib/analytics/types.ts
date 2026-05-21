export type DidAnalyticsEventName =
  | "did_sdk_import_start"
  | "did_sdk_import_complete"
  | "did_manager_create_start"
  | "did_manager_create_complete"
  | "did_connect_start"
  | "did_connect_complete"
  | "did_src_ready"
  | "did_video_play_start"
  | "did_video_play_complete"
  | "did_connected"
  | "did_error"
  | "did_disconnected";

export type AnalyticsEventName =
  | "page_view"
  | "persona_selected"
  | "chat_message_sent"
  | "session_lifecycle"
  | "did_stream_started"
  | "did_stream_error"
  | DidAnalyticsEventName;

export type AnalyticsPayload = {
  path?: string;
  personaId?: string;
  messageLength?: number;
  error?: string;
  /** Milliseconds since session mount (performance.now baseline). */
  elapsedMs?: number;
  /** Milliseconds for a single phase (e.g. SDK import). */
  phaseMs?: number;
  agentId?: string;
};

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  payload?: AnalyticsPayload;
  ts: string;
};
