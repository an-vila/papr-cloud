import { formatBytes } from "@/assets/assets";
import { driveService } from "@/services/driveService";
import { XIcon, Loader2Icon, FileTextIcon, DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";

const FilePreview = ({ file, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(file?.id));
  const [error, setError] = useState(null);

  const mime = file?.mime_type || "";

  useEffect(() => {
    if (!file?.id) {
      setPreviewUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    setPreviewUrl(null);
    setIsLoading(true);
    setError(null);

    driveService
      .getFilePreview(file.id)
      .then(({ data }) => {
        if (!isMounted) return;

        if (typeof data?.url !== "string" || !data.url) {
          setError("The server did not return a preview URL.");
          return;
        }

        setPreviewUrl(data.url);
      })
      .catch((err) => {
        if (isMounted) {
          const message = err.response?.data?.error || err.message;

          setError(
            typeof message === "string" && message
              ? message
              : "Failed to load file preview",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [file?.id]);

  if (!file) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slide-up"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <FileTextIcon className="size-5 text-orange-600 shrink-0" />

            <div className="min-w-0">
              <h3 className="text-base font-medium text-slate-900 truncate">
                {file.name}
              </h3>

              <p className="text-xs text-slate-500">
                {formatBytes(file.size || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {previewUrl && (
              <a
                href={previewUrl}
                download={file.name}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-50 min-h-80">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Loader2Icon className="size-8 animate-spin text-orange-600" />
              <p className="text-sm font-medium">Loading preview...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              <p>{error}</p>
            </div>
          ) : mime.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="max-h-[70vh] max-w-full object-contain rounded-xl border border-slate-200"
            />
          ) : mime.startsWith("video/") ? (
            <video
              src={previewUrl}
              controls
              className="max-h-[70vh] max-w-full rounded-xl border border-slate-200"
            />
          ) : mime.startsWith("audio/") ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-4">
              <p className="text-sm text-slate-800 font-semibold">
                {file.name}
              </p>

              <audio src={previewUrl} controls className="w-72 md:w-96" />
            </div>
          ) : mime === "application/pdf" ? (
            <iframe
              src={previewUrl}
              title={file.name}
              className="w-full h-[70vh] rounded-xl border border-slate-200"
            />
          ) : (
            <div className="text-center p-10 bg-white border border-slate-200 rounded-2xl max-w-sm">
              <FileTextIcon className="size-12 text-slate-400 mx-auto mb-3" />

              <p className="text-sm text-slate-700 mb-1">
                No direct preview available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
