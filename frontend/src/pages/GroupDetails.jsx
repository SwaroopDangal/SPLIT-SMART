import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  createInvitationLink,
  getGroupInfoById,
  getMyRoleinGroup,
} from "../lib/api";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Link2,
  X,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

const GroupDetails = () => {
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteData?.invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recentExpenses = [
    {
      id: 1,
      description: "Dinner at Italian Restaurant",
      amount: 150.0,
      paidBy: "John Doe",
      date: "2025-12-29",
      splitBetween: 4,
    },
    {
      id: 2,
      description: "Uber to Times Square",
      amount: 25.5,
      paidBy: "Sarah Smith",
      date: "2025-12-28",
      splitBetween: 3,
    },
    {
      id: 3,
      description: "Hotel Booking",
      amount: 450.0,
      paidBy: "Mike Johnson",
      date: "2025-12-27",
      splitBetween: 5,
    },
    {
      id: 4,
      description: "Broadway Show Tickets",
      amount: 280.0,
      paidBy: "John Doe",
      date: "2025-12-26",
      splitBetween: 4,
    },
  ];

  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: myRoleData, isLoading } = useQuery({
    queryKey: ["role-in-group", id],
    queryFn: () => getMyRoleinGroup(id),
  });
  const isAdmin = myRoleData?.role === "admin";

  const { data: groupData, isLoading: isGroupLoading } = useQuery({
    queryKey: ["group-info", id],
    queryFn: () => getGroupInfoById(id),
  });

  const { data: inviteData, isLoading: isInviteLoading } = useQuery({
    queryKey: ["group-invite", id],
    queryFn: () => createInvitationLink(id),
  });

  if (!isSignedIn) return <Navigate to="/" />;

  if (isLoading || isGroupLoading) return <div>Loading...</div>;

  if (!myRoleData?.canEnter) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Group Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-4 border-white/30">
                <img
                  src={groupData?.profileImage}
                  alt={groupData?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {groupData?.name}
                </h1>
                <p className="text-emerald-100 text-sm">
                  {groupData?.members.length + 1} members
                </p>
              </div>
            </div>

            {/* Right: Add Expense Button */}
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="btn bg-white text-emerald-600 hover:bg-emerald-50 border-none shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        {isAdmin && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              className="btn btn-outline border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
              onClick={() => setShowInviteLinkModal(true)}
            >
              <Link2 className="w-4 h-4" />
              Create Invitation Link
            </button>
            <button className="btn btn-outline border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600">
              <Trash2 className="w-4 h-4" />
              Delete Group
            </button>
          </div>
        )}

        {/* Recent Expenses Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Recent Expenses
          </h2>

          {/* Expenses List */}
          <div className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {expense.description}
                      </h3>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>
                          Paid by <strong>{expense.paidBy}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span>
                          Split between <strong>{expense.splitBetween}</strong>{" "}
                          people
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="ml-4 btn btn-ghost btn-sm btn-circle text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No expenses yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Click "Add Expense" to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invitation Link Modal */}
      {showInviteLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Invitation Link
              </h2>
              <button
                onClick={() => setShowInviteLinkModal(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Share this link with friends to invite them to the group
              </p>

              {/* Link Display */}
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border-2 border-gray-200 mb-4">
                <input
                  type="text"
                  value={inviteData?.invitationLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`btn btn-sm ${
                    copied ? "btn-success" : "btn-primary"
                  } text-white`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Success Message */}
              {copied && (
                <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Link copied to clipboard!</span>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Anyone with this link can join the
                  group. Keep it private!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInviteLinkModal(false)}
                className="btn btn-outline flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Add Expense</h2>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="e.g., Dinner, Uber ride, Hotel"
                  className="input input-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="input input-bordered w-full pl-10 border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="input input-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* Paid By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paid By <span className="text-red-500">*</span>
                </label>
                <select className="select select-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                  <option value="">Select member</option>
                  <option value="1">John Doe</option>
                  <option value="2">Sarah Smith</option>
                  <option value="3">Mike Johnson</option>
                </select>
              </div>

              {/* Split Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Split Type
                </label>
                <div className="flex gap-2">
                  <button className="btn btn-sm flex-1 bg-emerald-600 text-white hover:bg-emerald-700">
                    Equally
                  </button>
                  <button className="btn btn-sm flex-1 btn-outline">
                    Unequally
                  </button>
                  <button className="btn btn-sm flex-1 btn-outline">
                    Percentage
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
