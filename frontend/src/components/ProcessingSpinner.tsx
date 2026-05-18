import { Loader2, Eye, FileSearch, Brain, Wrench } from "lucide-react";
import { useState, useEffect } from "react";

const STEPS = [
  { icon: Eye, label: "Reading your document..." },
  { icon: FileSearch, label: "Extracting text with OCR..." },
  { icon: Brain, label: "Analyzing with Gemma 4..." },
  { icon: Wrench, label: "Generating actions and reply..." },
];

interface Props {
  preview: string | null;
}

export default function ProcessingSpinner({ preview }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STEPS[step].icon;

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      {preview && (
        <div className="mx-auto w-48 h-64 rounded-xl overflow-hidden shadow-md border border-gray-200">
          <img
            src={preview}
            alt="Uploaded notice"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
          <CurrentIcon className="w-6 h-6 text-brand-600" />
        </div>
        <p className="text-lg font-medium text-gray-700">
          {STEPS[step].label}
        </p>
        <div className="flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= step ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
