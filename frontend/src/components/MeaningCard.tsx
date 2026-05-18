import { BookOpen } from "lucide-react";

interface Props {
  summary: string;
  audioUrl: string | null;
  language: string;
}

export default function MeaningCard({ summary }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-sage-300/50 shadow-card overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-2.5 border-b bg-navy-50 border-sage-300/40">
        <div className="w-7 h-7 bg-navy-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="font-semibold text-navy-600">What This Means</h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-navy-500 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      </div>
    </div>
  );
}
