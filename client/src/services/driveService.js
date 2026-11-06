import api from "@/config/api";

export const driveService = {
  getFolders: (parentId) =>
    api.get("/api/folders", { params: { parent_id: parentId } }),

  getAllFolders: () => api.get("/api/folders"),

  getFiles: (folderId, search, sort) =>
    api.get("/api/files", { params: { folder_id: folderId, search, sort } }),

  getFolderDetails: (folderId) => api.get(`/api/folders/${folderId}`),

  uploadFiles: (fileList, folderId) => {
    const formData = new FormData();

    Array.from(fileList).forEach((f) => formData.append("files", f));
    if (folderId) formData.append("folder_id", folderId);

    return api.post("/api/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  createFolder: (name, parentId) =>
    api.post("api/folders", { name, parent_id: parentId }),

  renameItem: (endpoint, id, name) =>
    api.patch(`/api/${endpoint}/${id}/rename`, { name }),

  moveItem: (endpoint, id, payload) =>
    api.patch(`/api/${endpoint}/${id}/move`, payload),

  deleteItem: (endpoint, id) => api.delete(`/api/${endpoint}/${id}`),

  restoreItem: (endpoint, id) => api.post(`/api/${endpoint}/${id}/restore`),

  permanentlyDeleteItem: (endpoint, id) =>
    api.delete(`/api/${endpoint}/${id}/permanent`),

  getFilePreview: (fileId) => api.get(`/api/files/${fileId}/preview`),

  createShareLink: (resourceType, resourceId) =>
    api.post("/api/shares", {
      resource_type: resourceType,
      resource_id: resourceId,
      permission: "download",
    }),

  deleteShareLink: (shareId) => api.delete(`/api/shares/${shareId}`),

  getSharedLinks: () => api.get("/api/shares"),

  getPublicShare: (token) => api.get(`/api/shares/access/${token}`),

  getTrash: () => api.get("/api/trash"),

  emptyTrash: () => api.post("/api/trash/empty"),
};
