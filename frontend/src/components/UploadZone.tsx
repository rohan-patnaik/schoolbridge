import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera, FileText } from "lucide-react";

interface Props {
  onFile: (file: File) => void;
}

export default function UploadZone({ onFile }: Props) {
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
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-brand-500 bg-brand-50"
            : "border-gray-300 hover:border-brand-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-brand-600" />
          </div>
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-brand-600" />
          </div>
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-brand-600" />
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-700 mb-1">
          {isDragActive
            ? "Drop your school notice here"
            : "Upload a school notice"}
        </p>
        <p className="text-sm text-gray-500">
          Drag & drop a photo, scan, or PDF — or click to browse
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports JPG, PNG, WebP, PDF &middot; Max 10 MB
        </p>
      </div>
    </div>
  );
}
