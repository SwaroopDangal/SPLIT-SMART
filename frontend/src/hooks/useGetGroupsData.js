import React from "react";
import { getGroups } from "../lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetGroupsData = () => {
  const groupData = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
  return { myGroupData: groupData.data, isLoading: groupData.isLoading };
};

export default useGetGroupsData;
