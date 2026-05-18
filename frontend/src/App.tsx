import { useState } from "react";
import { useNoticeProcessor } from "./hooks/useNoticeProcessor";
import { useDarkMode } from "./hooks/useDarkMode";
import { t } from "./i18n/translations";
import Layout from "./components/Layout";
import UploadZone from "./components/UploadZone";
import ProcessingSpinner from "./components/ProcessingSpinner";
import ResultCards from "./components/ResultCards";
import SampleNotices from "./components/SampleNotices";

export default function App() {
  const [language, setLanguage] = useState("en");
  const { dark, toggle: toggleDark } = useDarkMode();
  const { state, result, error, preview, process, reset } =
    useNoticeProcessor();

  const handleFile = (file: File) => {
    process(file, language);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (state === "done" || state === "error") {
      reset();
    }
  };

  return (
    <Layout
      language={language}
      onLanguageChange={handleLanguageChange}
      dark={dark}
      onToggleDark={toggleDark}
    >
      {state === "idle" && (
        <div className="space-y-10">
          <UploadZone onFile={handleFile} language={language} />
          <SampleNotices onSelect={handleFile} language={language} />
        </div>
      )}

      {state === "processing" && <ProcessingSpinner preview={preview} language={language} />}

      {state === "done" && result && (
        <ResultCards
          response={result}
          language={language}
          onReset={reset}
        />
      )}

      {state === "error" && (
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <div className="bg-white dark:bg-navy-700 rounded-2xl border border-red-200 dark:border-red-800 shadow-card p-6">
            <p className="text-red-700 dark:text-red-400 font-semibold">{t(language, "somethingWrong")}</p>
            <p className="text-red-600/80 dark:text-red-400/70 text-sm mt-1.5">{error}</p>
          </div>
          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white rounded-xl font-medium shadow-sm hover:bg-accent-600 transition-all">
            {t(language, "tryAgain")}
          </button>
        </div>
      )}
    </Layout>
  );
}
