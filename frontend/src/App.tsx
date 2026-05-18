import { useState } from "react";
import { useNoticeProcessor } from "./hooks/useNoticeProcessor";
import Layout from "./components/Layout";
import UploadZone from "./components/UploadZone";
import ProcessingSpinner from "./components/ProcessingSpinner";
import ResultCards from "./components/ResultCards";
import SampleNotices from "./components/SampleNotices";

export default function App() {
  const [language, setLanguage] = useState("en");
  const { state, result, error, preview, process, reset } =
    useNoticeProcessor();

  const handleFile = (file: File) => {
    process(file, language);
  };

  return (
    <Layout language={language} onLanguageChange={setLanguage}>
      {state === "idle" && (
        <div className="space-y-8">
          <UploadZone onFile={handleFile} />
          <SampleNotices onSelect={handleFile} />
        </div>
      )}

      {state === "processing" && <ProcessingSpinner preview={preview} />}

      {state === "done" && result && (
        <ResultCards
          response={result}
          language={language}
          onReset={reset}
        />
      )}

      {state === "error" && (
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700 font-medium">Something went wrong</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={reset}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </Layout>
  );
}
