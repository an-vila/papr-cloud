
import { LucideFolder } from "lucide-react";
import { ItemDropdown } from "../ui/ItemDropdown";

const FolderCard = ({
  folder,
  onClick,
  onShare,
  onRename,
  onMove,
  onDelete,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDropTarget = false,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group relative bg-white border rounded-xl p-4 transition-all duration-200 flex items-center justify-between ${
        isDropTarget
          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200 scale-[1.02]"
          : "border-slate-200 hover:border-orange-200"
      }`}
    >
      <button
        type="button"
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={() => onClick(folder)}
        title="Open folder or drag it to another folder"
        className="flex-1 flex items-center gap-3 min-w-0 pr-2 text-left cursor-pointer"
      >
        <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shrink-0 border border-orange-100">
          <LucideFolder className="size-6 fill-orange-500/20" />
        </div>

        <h4
          className="text-sm font-medium text-slate-800 truncate group-hover:text-orange-600 transition-colors"
          title={folder.name}
        >
          {folder.name}
        </h4>
      </button>

      <div onClick={(e) => e.stopPropagation()}>
        <ItemDropdown
          item={folder}
          onShare={onShare}
          onRename={onRename}
          onMove={onMove}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default FolderCard;
