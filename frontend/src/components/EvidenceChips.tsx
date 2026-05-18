import { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import type { EvidenceItem } from "../types/notice";

interface Props {
  evidence: EvidenceItem[];
}

export default function EvidenceChips({ evidence }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-navy-700 rounded-2xl border border-sage-300/50 dark:border-navy-600/50 shadow-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-sage-50 dark:hover:bg-navy-600/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-navy-300 dark:text-sage-400" />
          <span className="text-sm font-semibold text-navy-500 dark:text-sage-200">
            Evidence ({evidence.length} sources)
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-sage-400 dark:text-sage-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-sage-400 dark:text-sage-500" />
        )}
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-sage-200/50 dark:border-navy-600/40 pt-4">
          {evidence.map((item, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium text-navy-500 dark:text-sage-200">{item.claim}</p>
              <p className="text-sage-500 dark:text-sage-400 mt-1 italic leading-relaxed">
                &ldquo;{item.source_quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
