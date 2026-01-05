import React from "react";
import { DollarSign, Calendar } from "lucide-react";
import { useGetRecentActivites } from "../hooks/useGetRecentActivites";
import LoaderPage from "./Loader";

export default function RecentActivity() {
  const { recentActivities: activities, isRecentActivitiesLoading } =
    useGetRecentActivites();

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "EXPENSE_ADDED":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };
  if (isRecentActivitiesLoading) return <LoaderPage />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6  mx-auto my-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No recent activity yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-medium">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {activity.groupId.name}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
