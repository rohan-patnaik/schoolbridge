import type { ProcessNoticeResponse } from "../types/notice";
import MeaningCard from "./MeaningCard";
import ActionCard from "./ActionCard";
import ReplyCard from "./ReplyCard";
import EvidenceChips from "./EvidenceChips";
import AudioButton from "./AudioButton";
import { ArrowLeft, Clock, Zap, Timer } from "lucide-react";
import { t } from "../i18n/translations";

interface Props {
  response: ProcessNoticeResponse;
  language: string;
  onReset: () => void;
}

const URGENCY_STYLES = {
  low: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40",
  medium: "bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 border-accent-200 dark:border-accent-800/40",
  high: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40",
};

const URGENCY_KEYS: Record<string, string> = {
  low: "urgLow",
  medium: "urgMed",
  high: "urgHigh",
};

export default function ResultCards({ response, language, onReset }: Props) {
  const { analysis, audio_url, processing_time_ms } = response;
  const urgency = analysis.urgency as keyof typeof URGENCY_STYLES;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onReset} className="inline-flex items-center gap-1.5 text-sm text-navy-300 dark:text-sage-400 hover:text-navy-500 dark:hover:text-sage-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t(language, "analyzeAnother")}
        </button>
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${URGENCY_STYLES[urgency]}`}
          >
            {t(language, URGENCY_KEYS[urgency])}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sage-100 dark:bg-navy-600 text-sage-500 dark:text-sage-300 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {analysis.confidence >= 0.8
              ? t(language, "highConf")
              : analysis.confidence >= 0.5
                ? t(language, "medConf")
                : t(language, "lowConf")}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sage-100 dark:bg-navy-600 text-sage-500 dark:text-sage-300 flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {(processing_time_ms / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Deadline banner */}
      {analysis.deadline && (
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800/30 rounded-2xl px-5 py-3 flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-accent-600 dark:text-accent-400 flex-shrink-0" />
          <p className="text-sm text-accent-800 dark:text-accent-300 font-semibold">
            {t(language, "deadline")}: {analysis.deadline}
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-5">
        <MeaningCard summary={analysis.summary} audioUrl={audio_url} language={language} />
        <ActionCard
          actions={analysis.required_actions}
          itemsNeeded={analysis.items_needed}
          language={language}
        />
        {analysis.reply_needed && (
          <ReplyCard draft={analysis.reply_draft} language={language} />
        )}
      </div>

      {/* Evidence */}
      {analysis.evidence.length > 0 && (
        <EvidenceChips evidence={analysis.evidence} language={language} />
      )}

      {/* Audio */}
      {audio_url && <AudioButton url={audio_url} language={language} />}
    </div>
  );
}
