import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { driveService } from "@/services/driveService";
import { useApp } from "@/context/AppContext";
import { dummyFiles, dummyFolders } from "@/assets/assets";

const ROOT_BREADCRUMB = [{ id: null, name: "My Drive" }];

const isFolderItem = (item) =>
  item?.item_type === "folder" || (!item?.mime_type && item.path !== undefined);

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

  const { refreshUser } = useApp();

  const fetchDriveContent = useCallback(
    async (folderId = currentFolderId, search = searchQuery, sort = sortBy) => {
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
    },
    [currentFolderId, searchQuery, sortBy],
  );

  const runAction = useCallback(
    async (apiCall, successMsg, errorMsg, afterSuccess) => {
      try {
        const res = await apiCall;

        if (successMsg) toast.success(successMsg);
        if (afterSuccess) await afterSuccess(res?.data);

        return true;
      } catch (error) {
        toast.error(error.response?.data?.error || errorMsg);

        return false;
      }
    },
    [],
  );

  const uploadFiles = useCallback(
    async (fileList, folder_id = currentFolderId) => {
      if (!fileList || !fileList.length) return;

      setIsUploading(true);
      setUploadProgress(0);

      const totalSize = Array.from(fileList).reduce(
        (acc, f) => acc + (f.size || 0),
        0,
      );
      const step = 92 / Math.max(12, totalSize / 409715.2);

      const interval = setInterval(() => {
        setUploadProgress((p) => (p >= 92 ? p : Math.min(92, p + step)));
      }, 100);

      try {
        const { data } = await driveService.uploadFiles(fileList, folder_id);

        clearInterval(interval);
        setUploadProgress(100);

        await new Promise((resolve) => setTimeout(resolve, 300));

        toast.success(`${data.files.length} file(s) uploaded successfully.`);
        await fetchDriveContent(folder_id);
        await refreshUser();
      } catch (error) {
        clearInterval(interval);
        toast.error(error.response?.data?.error || "File upload failed");
      } finally {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [currentFolderId, fetchDriveContent, refreshUser],
  );

  const createFolder = useCallback(
    (name, parent_id = currentFolderId) => {
      return runAction(
        driveService.createFolder(name, parent_id),
        "Folder created.",
        "Error creating folder.",
        () => fetchDriveContent(parent_id),
      );
    },
    [runAction, currentFolderId, fetchDriveContent],
  );

  const renameItem = useCallback(
    (item, newName) => {
      const isFolder = isFolderItem(item);
      const endpoint = isFolder ? "folders" : "files";
      const id = item.id || item;

      return runAction(
        driveService.renameItem(endpoint, id, newName),
        `${isFolder ? "Folder" : "File"} renamed.`,
        "Error renaming item.",
        () => fetchDriveContent(),
      );
    },
    [runAction, fetchDriveContent],
  );

  const moveItem = useCallback(
    (item, targetFolderId) => {
      const isFolder = isFolderItem(item);
      const endpoint = isFolder ? "folders" : "files";
      const payload = isFolder
        ? { target_parent: targetFolderId }
        : { target_folder: targetFolderId };
      const id = item.id || item;

      return runAction(
        driveService.moveItem(endpoint, id, payload),
        `${isFolder ? "Folder" : "File"} moved.`,
        "Error moving item.",
        () => fetchDriveContent(),
      );
    },
    [runAction, fetchDriveContent],
  );

  const deleteItem = useCallback(
    (item) => {
      const isFolder = isFolderItem(item);
      const endpoint = isFolder ? "folders" : "files";
      const id = item.id || item;

      return runAction(
        driveService.deleteItem(endpoint, id),
        `${isFolder ? "Folder" : "File"} moved to Trash.`,
        "Error deleting item.",
        () => fetchDriveContent(),
      );
    },
    [runAction, fetchDriveContent],
  );

  const permanentlyDeleteItem = useCallback(
    (item) => {
      const endpoint = isFolderItem(item) ? "folders" : "files";
      const id = item.id || item;

      return runAction(
        driveService.permanentlyDeleteItem(endpoint, id),
        "Item permanently deleted",
        "Error deleting item.",
        () => refreshUser(),
      );
    },
    [runAction, refreshUser],
  );

  const restoreItem = useCallback(
    (item) => {
      const endpoint = isFolderItem(item) ? "folders" : "files";
      const id = item.id || item;

      return runAction(
        driveService.restoreItem(endpoint, id),
        "Item restored",
        "Error restoring item.",
        () => fetchDriveContent(),
      );
    },
    [runAction, fetchDriveContent],
  );

  return {
    currentFolderId,
    setCurrentFolderId,
    breadcrumbs,
    folders,
    setFolders,
    files,
    setFiles,
    isDriveLoading,
    fetchDriveContent,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    uploadFiles,
    createFolder,
    renameItem,
    moveItem,
    deleteItem,
    restoreItem,
    permanentlyDeleteItem,
  };
};
