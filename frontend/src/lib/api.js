import { axiosInstance } from "./axios";

export const createGroup = async ({ name, photo }) => {
  const formData = new FormData();
  formData.append("name", name);
  if (photo) {
    formData.append("photo", photo);
  }
  const response = await axiosInstance.post("/group", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getGroups = async () => {
  const response = await axiosInstance.get("/group");
  return response.data;
};
export const getMyRoleinGroup = async (id) => {
  const response = await axiosInstance.get(`/group/${id}/role`);
  return response.data;
};
export const getGroupInfoById = async (id) => {
  const response = await axiosInstance.get(`/group/${id}`);
  return response.data;
};

export const createInvitationLink = async (groupId) => {
  const response = await axiosInstance.get(`/group/${groupId}/invite`);
  return response.data;
};
export const verifyInvitationLink = async (groupId, token) => {
  const response = await axiosInstance.get(`/group/${groupId}/invite/${token}`);
  return response.data;
};
export const deleteGroup = async (id) => {
  const response = await axiosInstance.delete(`/group/${id}`);
  return response.data;
};

export const addExpense = async (expense) => {
  const response = await axiosInstance.post("/expense", expense);
  return response.data;
};

export const getAllExpensesOfAGroup = async (id) => {
  const response = await axiosInstance.get(`/expense/${id}`);
  return response.data;
};
export const deleteExpense = async (id, groupId) => {
  const response = await axiosInstance.delete(`/expense/${groupId}/${id}`);
  return response.data;
};
export const getStats = async () => {
  const response = await axiosInstance.get("/stats");
  return response.data;
};
export const getGroupExpensesAndSettlements = async (id) => {
  const response = await axiosInstance.get(`/group/${id}/expenses`);
  return response.data;
};
export const settleAllExpensesOfAGroup = async (id) => {
  const response = await axiosInstance.delete(`/expense/${id}/settle`);
  return response.data;
};
export const getUserRecentActivities = async () => {
  const response = await axiosInstance.get("/recentActivity/recentActivities");
  return response.data;
};
