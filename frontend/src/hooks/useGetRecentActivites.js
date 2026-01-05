import { useQuery } from "@tanstack/react-query";
import { getUserRecentActivities } from "../lib/api";

export const useGetRecentActivites = () => {
  const { data: recentActivities, isLoading: isRecentActivitiesLoading } =
    useQuery({
      queryKey: ["recentActivities"],
      queryFn: getUserRecentActivities,
      retry: false,
    });
  return { recentActivities, isRecentActivitiesLoading };
};
