import { useState } from "react";
import { CheckSquare, Square, Package, Calendar } from "lucide-react";
import type { ActionItem } from "../types/notice";

interface Props {
  actions: ActionItem[];
  itemsNeeded: string[];
}

export default function ActionCard({ actions, itemsNeeded }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-sage-300/50 shadow-card overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-2.5 border-b bg-green-50/80 border-green-100">
        <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
          <CheckSquare className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="font-semibold text-green-800">
          What You Need to Do
        </h2>
      </div>
      <div className="px-5 py-4 space-y-3">
        {actions.length === 0 && (
          <p className="text-sage-500 text-sm">
            No specific actions required — this is for your information.
          </p>
        )}
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-start gap-3 w-full text-left group rounded-xl px-2 py-1.5 -mx-2 hover:bg-sage-50 transition-colors"
          >
            {checked.has(i) ? (
              <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Square className="w-5 h-5 text-sage-300 group-hover:text-accent-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span
                className={`text-sm ${
                  checked.has(i)
                    ? "line-through text-sage-400"
                    : "text-navy-500"
                }`}
              >
                {action.action}
              </span>
              {action.deadline && (
                <span className="flex items-center gap-1 text-xs text-accent-600 mt-0.5 font-medium">
                  <Calendar className="w-3 h-3" />
                  {action.deadline}
                </span>
              )}
            </div>
          </button>
        ))}

        {itemsNeeded.length > 0 && (
          <div className="pt-3 border-t border-sage-200/60">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Items to gather
            </p>
            <div className="flex flex-wrap gap-2">
              {itemsNeeded.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-sage-100 text-navy-400 px-3 py-1.5 rounded-full font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
