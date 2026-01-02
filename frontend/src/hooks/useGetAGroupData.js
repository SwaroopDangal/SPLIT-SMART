import React from "react";
import { getGroupInfoById } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAGroupData = (id) => {
  const { data: groupData, isLoading: isGroupLoading } = useQuery({
    queryKey: ["group-info", id],
    queryFn: () => getGroupInfoById(id),
  });
  return { groupData, isGroupLoading };
};

export default useGetAGroupData;
