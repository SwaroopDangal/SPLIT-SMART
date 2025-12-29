import { useState } from "react";
import { LayoutDashboard, Users, Plus, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [groups] = useState([
    { id: 1, name: "NYC Trip", members: 5, color: "bg-blue-500" },
    { id: 2, name: "Roommates", members: 3, color: "bg-purple-500" },
    { id: 3, name: "Office Lunch", members: 8, color: "bg-orange-500" },
    { id: 4, name: "Weekend Getaway", members: 4, color: "bg-pink-500" },
  ]);

  return (
    <div className="w-64 h-screen bg-base-200 border-r border-base-300 flex flex-col">
      {/* Dashboard Section */}
      <div className="p-4">
        <button
          onClick={() => setActiveSection("dashboard")}
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
          <button className="btn btn-ghost btn-xs btn-circle text-emerald-600">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveSection(`group-${group.id}`)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                activeSection === `group-${group.id}`
                  ? "bg-emerald-50 border-2 border-emerald-600"
                  : "hover:bg-base-300 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center shadow-sm`}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-base-content">
                    {group.name}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {group.members} members
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-colors ${
                  activeSection === `group-${group.id}`
                    ? "text-emerald-600"
                    : "text-base-content/40"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Create New Group */}
        <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-dashed border-base-300 hover:border-emerald-600 hover:bg-emerald-50 transition-all text-base-content/60 hover:text-emerald-600">
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Create New Group</span>
        </button>
      </div>
    </div>
  );
}
