import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera, FileText } from "lucide-react";
import { t } from "../i18n/translations";

interface Props {
  onFile: (file: File) => void;
  language: string;
}

export default function UploadZone({ onFile, language }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20 scale-[1.01]"
            : "border-sage-300 dark:border-navy-500 hover:border-accent-400 hover:bg-white dark:hover:bg-navy-800 hover:shadow-card-hover"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center gap-4 mb-5">
          <div className="w-12 h-12 bg-sage-100 dark:bg-navy-700 rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-navy-300 dark:text-sage-400" />
          </div>
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-accent-600 dark:text-accent-400" />
          </div>
          <div className="w-12 h-12 bg-sage-100 dark:bg-navy-700 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-navy-300 dark:text-sage-400" />
          </div>
        </div>
        <p className="text-lg font-semibold text-navy-600 dark:text-sage-100 mb-1.5">
          {isDragActive
            ? t(language, "uploadDragTitle")
            : t(language, "uploadTitle")}
        </p>
        <p className="text-sm text-sage-500 dark:text-sage-400">
          {t(language, "uploadDesc")}
        </p>
        <p className="text-xs text-sage-400 dark:text-sage-500 mt-2.5">
          {t(language, "uploadFormats")}
        </p>
      </div>
    </div>
  );
}
