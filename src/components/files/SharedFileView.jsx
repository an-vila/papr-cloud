import { formatBytes, getFileIcon } from "@/assets/assets";
import { DownloadIcon } from "lucide-react";

const SharedFileView = ({ data }) => (
  <div className="max-w-xl w-full p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-6 animate-fade-in">
    <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
      {getFileIcon(data.file.mime_type, "size-10")}
    </div>

    <div>
      <h2 className="text-xl font-medium text-slate-900 mb-1">
        {data.file.name}
      </h2>
      <p className="text-xs text-slate-500">
        Size: {formatBytes(data.file.size)} • Shared by {data.owner?.name || "User"}
      </p>
    </div>

    {data.permission === "download" && (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
        This link grants <span className="text-orange-600 font-semibold">download-only</span> permission.
      </div>
    )}

    {data.url && (
      <a
        href={data.url}
        download={data.file.name}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition"
      >
        <DownloadIcon className="size-4" />
        <span>Download File</span>
      </a>
    )}
  </div>
);

export default SharedFileView;
