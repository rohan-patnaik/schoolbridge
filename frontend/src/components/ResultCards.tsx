import type { ProcessNoticeResponse } from "../types/notice";
import MeaningCard from "./MeaningCard";
import ActionCard from "./ActionCard";
import ReplyCard from "./ReplyCard";
import EvidenceChips from "./EvidenceChips";
import AudioButton from "./AudioButton";
import { ArrowLeft, Clock, Zap } from "lucide-react";

interface Props {
  response: ProcessNoticeResponse;
  language: string;
  onReset: () => void;
}

const URGENCY_STYLES = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Analyze another notice
        </button>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${URGENCY_STYLES[urgency]}`}
          >
            {URGENCY_LABELS[urgency]}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {analysis.confidence >= 0.8
              ? "High confidence"
              : analysis.confidence >= 0.5
                ? "Medium confidence"
                : "Low confidence"}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {(processing_time_ms / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {analysis.deadline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Deadline: {analysis.deadline}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1">
        <MeaningCard summary={analysis.summary} audioUrl={audio_url} language={language} />
        <ActionCard
          actions={analysis.required_actions}
          itemsNeeded={analysis.items_needed}
        />
        {analysis.reply_needed && (
          <ReplyCard draft={analysis.reply_draft} />
        )}
      </div>

      {analysis.evidence.length > 0 && (
        <EvidenceChips evidence={analysis.evidence} />
      )}

      {audio_url && <AudioButton url={audio_url} />}
    </div>
  );
}
