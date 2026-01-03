import React from "react";
import { getStats } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetStats = () => {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
  return { stats, isStatsLoading };
};

export default useGetStats;
