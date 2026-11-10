import { useRef, useState } from "react";
import { Spinner } from "../ui/Spinner";
import { EmptyState } from "../ui/EmptyState";
import FolderCard from "../folders/FolderCard";
import FileCard from "./FileCard";
import { LucideFolder } from "lucide-react";
import { ItemDropdown } from "../ui/ItemDropdown";
import { formatBytes, getFileIcon } from "@/assets/assets";
import { format } from "date-fns";
import { useDrive } from "@/hooks/useDrive";

const getPathIds = (path) => {
  if (Array.isArray(path)) {
    return path
      .map((item) =>
        typeof item === "object" && item !== null ? item.id : item,
      )
      .filter(Boolean)
      .map(String);
  }

  if (typeof path === "string") {
    return path.split(/[\\/]/).filter(Boolean).map(String);
  }

  return [];
};

const canDropOnFolder = (source, target) => {
  if (!source || !target) return false;

  if (String(source.id) === String(target.id)) return false;

  if (source.item_type === "folder") {
    if (String(source.parent_id) === String(target.id)) return false;

    if (getPathIds(target.path).includes(String(source.id))) {
      return false;
    }
  } else {
    if (String(source.folder_id) === String(target.id)) return false;
  }

  return true;
};

const formatItemDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime()) ? "—" : format(parsed, "MMM d, yyyy");
};

const FileGrid = ({
  files,
  folders,
  isDriveLoading,
  onFolderClick,
  onPreviewFile,
  onShareItem,
  onRenameItem,
  onMoveItem,
  onDeleteItem,
  onQuickMove,
}) => {
  const { viewMode } = useDrive();

  const draggedItemRef = useRef(null);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);

  const handleDragStart = (item, type) => (event) => {
    const source = {
      ...item,
      item_type: type,
    };

    draggedItemRef.current = source;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(item.id));
  };

  const handleDragEnd = () => {
    draggedItemRef.current = null;
    setDragOverFolderId(null);
  };

  const handleDragOver = (folder) => (event) => {
    const source = draggedItemRef.current;

    if (!source || !canDropOnFolder(source, folder)) {
      setDragOverFolderId(null);
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverFolderId(folder.id);
  };

  const handleDrop = (folder) => async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const source = draggedItemRef.current;

    draggedItemRef.current = null;
    setDragOverFolderId(null);

    if (!canDropOnFolder(source, folder)) return;
    if (!onQuickMove) return;

    await onQuickMove(source, folder.id);
  };

  if (isDriveLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Spinner size="lg" className="text-orange-600" />
        <p className="text-sm font-semibold">Loading items...</p>
      </div>
    );
  }

  const hasFolders = folders && folders.length > 0;
  const hasFiles = files && files.length > 0;

  if (!hasFolders && !hasFiles) {
    return <EmptyState />;
  }

  const canDrag = Boolean(onQuickMove);
  const isList = viewMode === "list";

  return (
    <div className="space-y-6">

      {/* FOLDERS: siempre en tarjetas */}
      {hasFolders && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Folders
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onClick={onFolderClick}
                onShare={(item) =>
                  onShareItem({ ...item, item_type: "folder" })
                }
                onRename={(item) =>
                  onRenameItem({ ...item, item_type: "folder" })
                }
                onMove={(item) =>
                  onMoveItem({ ...item, item_type: "folder" })
                }
                onDelete={(item) =>
                  onDeleteItem({ ...item, item_type: "folder" })
                }
                draggable={canDrag}
                onDragStart={handleDragStart(folder, "folder")}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver(folder)}
                onDrop={handleDrop(folder)}
                isDropTarget={dragOverFolderId === folder.id}
              />
            ))}
          </div>
        </div>
      )}


      {/* FILES */}
      {hasFiles && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Files
          </h3>

          {isList ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_100px_125px_40px] gap-3 px-4 py-2.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                <span>Name</span>
                <span>Size</span>
                <span>Date</span>
                <span />
              </div>

              <div className="divide-y divide-slate-100">
                {files.map((file) => (
                  <div
                    key={file.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onPreviewFile(file)}
                    onKeyDown={(event) => {
                      if (
                        event.target === event.currentTarget &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        onPreviewFile(file);
                      }
                    }}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_100px_125px_40px] gap-3 items-center px-3 sm:px-4 py-3 hover:bg-orange-50/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                  >
                    <div
                      draggable={canDrag}
                      onDragStart={handleDragStart(file, "file")}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-3 min-w-0 cursor-grab active:cursor-grabbing"
                    >
                      <span className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                        {getFileIcon(file.mime_type, "size-5")}
                      </span>

                      <span className="text-sm font-medium text-slate-800 truncate group-hover:text-orange-700">
                        {file.name}
                      </span>
                    </div>

                    <span className="hidden sm:block text-xs text-slate-500">
                      {formatBytes(file.size)}
                    </span>

                    <span className="hidden sm:block text-xs text-slate-500">
                      {formatItemDate(file.created_at)}
                    </span>

                    <div onClick={(e) => e.stopPropagation()}>
                      <ItemDropdown
                        item={file}
                        onPreview={onPreviewFile}
                        onShare={(item) =>
                          onShareItem({ ...item, item_type: "file" })
                        }
                        onRename={(item) =>
                          onRenameItem({ ...item, item_type: "file" })
                        }
                        onMove={(item) =>
                          onMoveItem({ ...item, item_type: "file" })
                        }
                        onDelete={(item) =>
                          onDeleteItem({ ...item, item_type: "file" })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onPreview={onPreviewFile}
                  onShare={(item) =>
                    onShareItem({ ...item, item_type: "file" })
                  }
                  onRename={(item) =>
                    onRenameItem({ ...item, item_type: "file" })
                  }
                  onMove={(item) => onMoveItem({ ...item, item_type: "file" })}
                  onDelete={(item) =>
                    onDeleteItem({ ...item, item_type: "file" })
                  }
                  draggable={canDrag}
                  onDragStart={handleDragStart(file, "file")}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileGrid;
