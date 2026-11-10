import { useDrive } from "@/hooks/useDrive";
import { Modal } from "../ui/Modal";
import { HardDriveIcon } from "lucide-react";
import { LucideFolder } from "lucide-react";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { driveService } from "@/services/driveService";

const MoveModal = ({ item, isOpen, onClose }) => {
  const [availableFolders, setAvailableFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const { moveItem } = useDrive();

  const currentParentId =
    item?.item_type === "folder"
      ? (item?.parent_id ?? null)
      : (item?.folder_id ?? null);

  useEffect(() => {
    if (!isOpen || !item) return;

    let cancelled = false;

    setSelectedFolderId(null);

    driveService
      .getAllFolders()
      .then(({ data }) => {
        const folders = data.folders || [];

        const filtered = folders.filter((folder) => {
          // No permitir la carpeta donde ya está el elemento.
          if (
            currentParentId != null &&
            String(folder.id) === String(currentParentId)
          ) {
            return false;
          }

          // Si es un archivo, ya hemos terminado las comprobaciones.
          if (item.item_type !== "folder") {
            return true;
          }

          // No permitir mover una carpeta dentro de sí misma.
          if (String(folder.id) === String(item.id)) {
            return false;
          }

          // No permitir moverla dentro de sus subcarpetas.
          const pathIds = Array.isArray(folder.path)
            ? folder.path.map((p) =>
                typeof p === "object" && p !== null ? p.id : p,
              )
            : typeof folder.path === "string"
              ? folder.path.split(/[\\/]/)
              : [];

          if (pathIds.map(String).includes(String(item.id))) {
            return false;
          }

          return true;
        });

        if (!cancelled) {
          setAvailableFolders(filtered);
        }
      })
      .catch((error) => {
        console.error("Error loading destination folders:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [item, isOpen, currentParentId]);

  const handleMove = async () => {
    if (!item || isMoving) return;

    const sameLocation =
      String(selectedFolderId ?? "") === String(currentParentId ?? "");

    if (sameLocation) return;

    setIsMoving(true);

    try {
      const success = await moveItem(item, selectedFolderId);

      if (success) {
        onClose();
      }
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Move "${item.name}"`}>
      <div className="space-y-4">
        <p className="text-xs font-medium text-slate-500">
          Select destination folder:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto divide-y divide-slate-200 p-1">
          {currentParentId !== null && (
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${selectedFolderId === null ? "bg-orange-50 text-orange-700 border border-orange-200 font-semibold" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <HardDriveIcon className="size-4 text-orange-600" />
              <span>My Drive (Root)</span>
            </button>
          )}

          {availableFolders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setSelectedFolderId(folder.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${selectedFolderId === folder.id ? "bg-orange-50 text-orange-700 border border-orange-200 font-semibold" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <LucideFolder className="size-4 text-orange-600 fill-orange-500/20" />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button
          variant="primary"
          isLoading={isMoving}
          onClick={handleMove}
          disabled={
            isMoving ||
            String(selectedFolderId ?? "") === String(currentParentId ?? "")
          }
        >
          Move Here
        </Button>
      </div>
    </Modal>
  );
};

export default MoveModal;
