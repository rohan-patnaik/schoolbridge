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
        className={`relative border-2 border-dashed rounded-3xl p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-accent-500 bg-accent-50 scale-[1.01]"
            : "border-sage-300 hover:border-accent-400 hover:bg-white hover:shadow-card-hover"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center gap-4 mb-5">
          <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center group-hover:bg-accent-50 transition-colors">
            <Camera className="w-5 h-5 text-navy-300" />
          </div>
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-accent-600" />
          </div>
          <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-navy-300" />
          </div>
        </div>
        <p className="text-lg font-semibold text-navy-600 mb-1.5">
          {isDragActive
            ? "Drop your school notice here"
            : "Upload a school notice"}
        </p>
        <p className="text-sm text-sage-500">
          Drag & drop a photo, scan, or PDF — or click to browse
        </p>
        <p className="text-xs text-sage-400 mt-2.5">
          Supports JPG, PNG, WebP, PDF &middot; Max 10 MB
        </p>
      </div>
    </div>
  );
}
