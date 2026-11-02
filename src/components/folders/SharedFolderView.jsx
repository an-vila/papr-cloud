import { formatBytes, getFileIcon } from "@/assets/assets";
import { LucideFolder, DownloadIcon } from "lucide-react";

const SharedFolderView = ({ data }) => (
  <div className="max-w-2xl w-full p-8 bg-white border border-slate-200 rounded-3xl space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
        <LucideFolder className="size-6 fill-orange-500/20" />
      </div>
      <div>
        <h2>{data.folder.name}</h2>
        <p className="text-xs text-slate-500">
          Shared Folder by {data.owner?.name || "User"}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Contents
      </h2>

      {!data.files || data.files.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
          This folder is empty.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden">
          {/* CORRECCIÓN: Cambiado data.files.amp por data.files.map */}
          {data.files.map((f) => (
            <div
              key={f.id}
              className="p-3.5 flex items-center justify-between hover:bg-slate-100/80 transition"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                {getFileIcon(f.mime_type, "size-5 shrink-0")}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(f.size)}
                  </p>
                </div>
              </div>
              {f.url && (
                <a
                  href={f.url}
                  download={f.name}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition shrink-0"
                >
                  <DownloadIcon className="size-3.5" />
                  <span>Download</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default SharedFolderView;
