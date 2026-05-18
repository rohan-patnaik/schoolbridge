import { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import type { EvidenceItem } from "../types/notice";

interface Props {
  evidence: EvidenceItem[];
}

export default function EvidenceChips({ evidence }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">
            Evidence ({evidence.length} sources)
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-gray-100 pt-3">
          {evidence.map((item, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium text-gray-700">{item.claim}</p>
              <p className="text-gray-500 mt-0.5 italic">
                &ldquo;{item.source_quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
