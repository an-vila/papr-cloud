import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { driveService } from "@/services/driveService";

const ROOT_BREADCRUMB = [{ id: null, name: "My Drive" }];

export const useDrive = () => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(ROOT_BREADCRUMB);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchDriveContent = useCallback(async (folderId = currentFolderId, search = searchQuery, sort = sortBy) => {
    setIsDriveLoading(true);

    try {
      const parentParam = folderId || "null";

      const [folderRes, fileRes, detailRes] = await Promise.all([
        driveService.getFolders(parentParam),
        driveService.getFiles(parentParam, search, sort),
        folderId ? driveService.getFolderDetails(folderId) : null,
      ]);

      setFolders(folderRes.data.folders);
      setFiles(fileRes.data.files);
      setBreadcrumbs(detailRes?.data?.breadcrumbs || ROOT_BREADCRUMB);
    } catch (error) {
      toast.error("Error loading drive contents");
    } finally {
      setIsDriveLoading(false);
    }
  }, [currentFolderId, searchQuery, sortBy]);

  return {
    currentFolderId, setCurrentFolderId,
    breadcrumbs,
    folders, setFolders,
    files, setFiles,
    isDriveLoading, fetchDriveContent,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    isUploading, setIsUploading,
    uploadProgress, setUploadProgress
  };
};
