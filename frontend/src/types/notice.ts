export interface EvidenceItem {
  claim: string;
  source_quote: string;
}

export interface ActionItem {
  action: string;
  deadline: string | null;
}

export interface NoticeAnalysis {
  doc_type: string;
  urgency: "low" | "medium" | "high";
  deadline: string | null;
  summary: string;
  required_actions: ActionItem[];
  items_needed: string[];
  reply_needed: boolean;
  reply_draft: string | null;
  evidence: EvidenceItem[];
  confidence: number;
}

export interface ProcessNoticeResponse {
  analysis: NoticeAnalysis;
  ocr_text: string;
  audio_url: string | null;
  processing_time_ms: number;
}

export type AppState = "idle" | "processing" | "done" | "error";
