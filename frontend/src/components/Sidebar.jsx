import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Plus, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroups } from "../lib/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: myGroupData, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const [activeSection, setActiveSection] = useState("dashboard");

  // Sync activeSection with current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") {
      setActiveSection("dashboard");
    } else if (path.startsWith("/group/")) {
      const groupId = path.split("/group/")[1];
      if (groupId && groupId !== "new") {
        setActiveSection(`group-${groupId}`);
      }
    }
  }, [location.pathname]);

  // Function to get random color for groups
  const getGroupColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-64 h-screen bg-base-200 border-r border-base-300 flex flex-col">
      {/* Dashboard Section */}
      <div className="p-4">
        <button
          onClick={() => {
            setActiveSection("dashboard");
            navigate("/dashboard");
          }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            activeSection === "dashboard"
              ? "bg-emerald-600 text-white shadow-md"
              : "hover:bg-base-300 text-base-content"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-semibold">Dashboard</span>
        </button>
      </div>

      <div className="divider my-0 px-4"></div>

      {/* Groups Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wide">
            Groups
          </h3>
          <button
            onClick={() => navigate("/group/new")}
            className="btn btn-ghost btn-xs btn-circle text-emerald-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 px-3 py-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Groups List */}
        {!isLoading && myGroupData && myGroupData.length > 0 && (
          <div className="space-y-2">
            {myGroupData.map((group, index) => (
              <button
                key={group._id}
                onClick={() => {
                  setActiveSection(`group-${group._id}`);
                  navigate(`/group/${group._id}`);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                  activeSection === `group-${group._id}`
                    ? "bg-emerald-50 border-2 border-emerald-600"
                    : "hover:bg-base-300 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Group Profile Image or Icon */}
                  {group.profileImage ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={group.profileImage}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-10 h-10 ${getGroupColor(
                        index
                      )} rounded-lg flex items-center justify-center shadow-sm`}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="text-left">
                    <p className="font-semibold text-sm text-base-content">
                      {group.name}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {group.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    activeSection === `group-${group._id}`
                      ? "text-emerald-600"
                      : "text-base-content/40"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && myGroupData && myGroupData.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-1">No groups yet</p>
            <p className="text-xs text-gray-500">Create your first group!</p>
          </div>
        )}

        {/* Create New Group */}
        <button
          type="button"
          className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-dashed border-base-300 hover:border-emerald-600 hover:bg-emerald-50 transition-all text-base-content/60 hover:text-emerald-600"
          onClick={() => navigate("/group/new")}
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Create New Group</span>
        </button>
      </div>
    </div>
  );
}
