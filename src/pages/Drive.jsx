import FileGrid from "@/components/files/FileGrid";
import { useDrive } from "@/hooks/useDrive";
import Breadcrumbs from "@/layout/Breadcrumbs";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Drive = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const {
    fetchDriveContent,
    setCurrentFolderId,
    deleteItem: removeDriveItem,
  } = useDrive();

  useEffect(() => {
    const id = folderId || null;
    setCurrentFolderId(id);
    fetchDriveContent(id);
  }, [folderId, fetchDriveContent, setCurrentFolderId]);

  const [previewFile, setPreviewFile] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  return (
    <div className="space-y-4">
      <Breadcrumbs />
      <FileGrid
        onFolderClick={(folder) => navigate(`/drive/${folder.id}`)}
        onPreviewFile={setPreviewFile}
        onShareItem={setShareItem}
        onRenameItem={setRenameItem}
        onMoveItem={setMoveItem}
        onDeleteItem={setDeleteItem}
      />
    </div>
  );
};

export default Drive;
