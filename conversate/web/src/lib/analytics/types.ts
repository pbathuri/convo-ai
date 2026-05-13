export type AnalyticsEventName =
  | "page_view"
  | "persona_selected"
  | "chat_message_sent"
  | "did_stream_started"
  | "did_stream_error";

export type AnalyticsPayload = {
  path?: string;
  personaId?: string;
  messageLength?: number;
  error?: string;
};

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  payload?: AnalyticsPayload;
  ts: string;
};
