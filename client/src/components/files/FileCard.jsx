import { formatBytes, getFileIcon } from "@/assets/assets";
import { ItemDropdown } from "../ui/ItemDropdown";
import { format } from "date-fns";

const FileCard = ({
  file,
  onPreview,
  onShare,
  onRename,
  onMove,
  onDelete,
  draggable = false,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPreview?.(file)}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onPreview?.(file);
        }
      }}
      className="group relative bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-grab active:cursor-grabbing"
          title="Drag file to another folder"
        >
          {getFileIcon(file.mime_type, "size-6")}
        </div>

        <div onClick={(event) => event.stopPropagation()}>
          <ItemDropdown
            item={file}
            onPreview={onPreview}
            onShare={onShare}
            onRename={onRename}
            onMove={onMove}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div>
        <h4
          className="text-sm font-medium text-slate-800 truncate group-hover:text-orange-700 transition-colors"
          title={file.name}
        >
          {file.name}
        </h4>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
          <span>{formatBytes(file.size)}</span>
          <span>
            {file.created_at
              ? format(new Date(file.created_at), "MMM d, yyyy")
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
