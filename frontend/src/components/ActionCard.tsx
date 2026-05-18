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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-emerald-600" />
        <h2 className="font-semibold text-emerald-800">
          What You Need to Do
        </h2>
      </div>
      <div className="px-5 py-4 space-y-3">
        {actions.length === 0 && (
          <p className="text-gray-500 text-sm">
            No specific actions required — this is for your information.
          </p>
        )}
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-start gap-3 w-full text-left group"
          >
            {checked.has(i) ? (
              <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Square className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span
                className={`text-sm ${
                  checked.has(i)
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {action.action}
              </span>
              {action.deadline && (
                <span className="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {action.deadline}
                </span>
              )}
            </div>
          </button>
        ))}

        {itemsNeeded.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              Items to gather
            </p>
            <div className="flex flex-wrap gap-2">
              {itemsNeeded.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
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
