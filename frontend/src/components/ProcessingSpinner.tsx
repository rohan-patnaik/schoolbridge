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
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {preview && (
        <div className="mx-auto w-48 h-64 rounded-2xl overflow-hidden shadow-card border border-sage-300/50 dark:border-navy-600/50">
          <img
            src={preview}
            alt="Uploaded notice"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
          <CurrentIcon className="w-6 h-6 text-navy-400 dark:text-sage-300" />
        </div>
        <p className="text-lg font-semibold text-navy-600 dark:text-sage-100">
          {STEPS[step].label}
        </p>
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-10 rounded-full transition-all duration-500 ${
                i <= step ? "bg-accent-500" : "bg-sage-200 dark:bg-navy-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
