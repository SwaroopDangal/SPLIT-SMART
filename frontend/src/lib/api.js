import { axiosInstance } from "./axios";

export const createGroup = async (data) => {
  const response = await axiosInstance.post("/group", data);
  return response.data;
};

export const getGroups = async () => {
  const response = await axiosInstance.get("/group");
  return response.data;
};
