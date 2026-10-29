import api from "@/config/api";

export const driveService = {
  getFolders: (parentId) =>
    api.get("/api/folders", { params: { parent_id: parentId } }),

  getFiles: (folderId, search, sort) =>
    api.get("/api/files", { params: { folder_id: folderId, search, sort } }),

  getFolderDetails: (folderId) =>
    api.get(`/api/folders/${folderId}`),
};
