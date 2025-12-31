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
