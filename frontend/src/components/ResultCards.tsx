import type { ProcessNoticeResponse } from "../types/notice";
import MeaningCard from "./MeaningCard";
import ActionCard from "./ActionCard";
import ReplyCard from "./ReplyCard";
import EvidenceChips from "./EvidenceChips";
import AudioButton from "./AudioButton";
import { ArrowLeft, Clock, Zap, Timer } from "lucide-react";

interface Props {
  response: ProcessNoticeResponse;
  language: string;
  onReset: () => void;
}

const URGENCY_STYLES = {
  low: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-accent-50 text-accent-700 border-accent-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const URGENCY_LABELS = {
  low: "Low Urgency",
  medium: "Needs Attention",
  high: "Action Required",
};

export default function ResultCards({ response, language, onReset }: Props) {
  const { analysis, audio_url, processing_time_ms } = response;
  const urgency = analysis.urgency as keyof typeof URGENCY_STYLES;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onReset} className="inline-flex items-center gap-1.5 text-sm text-navy-300 hover:text-navy-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Analyze another notice
        </button>
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${URGENCY_STYLES[urgency]}`}
          >
            {URGENCY_LABELS[urgency]}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sage-100 text-sage-500 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {analysis.confidence >= 0.8
              ? "High confidence"
              : analysis.confidence >= 0.5
                ? "Medium confidence"
                : "Low confidence"}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sage-100 text-sage-500 flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {(processing_time_ms / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Deadline banner */}
      {analysis.deadline && (
        <div className="bg-accent-50 border border-accent-200 rounded-2xl px-5 py-3 flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-accent-600 flex-shrink-0" />
          <p className="text-sm text-accent-800 font-semibold">
            Deadline: {analysis.deadline}
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-5">
        <MeaningCard summary={analysis.summary} audioUrl={audio_url} language={language} />
        <ActionCard
          actions={analysis.required_actions}
          itemsNeeded={analysis.items_needed}
        />
        {analysis.reply_needed && (
          <ReplyCard draft={analysis.reply_draft} />
        )}
      </div>

      {/* Evidence */}
      {analysis.evidence.length > 0 && (
        <EvidenceChips evidence={analysis.evidence} />
      )}

      {/* Audio */}
      {audio_url && <AudioButton url={audio_url} />}
    </div>
  );
}
