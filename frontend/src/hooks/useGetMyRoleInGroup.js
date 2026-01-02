import React from "react";
import { getMyRoleinGroup } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetMyRoleInGroup = (id) => {
  const { data: myRoleData, isLoading } = useQuery({
    queryKey: ["role-in-group", id],
    queryFn: () => getMyRoleinGroup(id),
  });
  return { myRoleData, isLoading, isAdmin: myRoleData?.role === "admin" };
};

export default useGetMyRoleInGroup;
