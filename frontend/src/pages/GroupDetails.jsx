import { useUser } from "@clerk/clerk-react";
import React, { useRef } from "react";
import { Navigate, useParams } from "react-router";
import { useState } from "react";
import { useReactToPrint } from "react-to-print";

import {
  Plus,
  Trash2,
  Link2,
  DollarSign,
  Calendar,
  User,
  Scale,
  FileText,
} from "lucide-react";
import useGetMyRoleInGroup from "../hooks/useGetMyRoleInGroup";
import useGetAGroupData from "../hooks/useGetAGroupData";
import InvitationModal from "../components/InvitationModal";
import DeleteModal from "../components/DeleteModal";
import AddExpenseModal from "../components/AddExpenseModal";
import useGetAllExpensesOfAGroup from "../hooks/useGetAllExpensesOfAGroup";
import LoaderPage from "../components/Loader";
import DeleteExpenseModal from "../components/DeleteExpenseModal";
import GroupBalanceModal from "../components/GroupBAlanceModal";
import PrintableSummary from "../components/PrintableSummary";
import useGetGroupExpensesAndSettlements from "../hooks/useGetGroupExpensesAndSettlements";

const GroupDetails = () => {
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showDeleteExpenseModal, setShowDeleteExpenseModal] = useState(false);
  const [expenseId, setExpenseId] = useState("");
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const { isSignedIn, user } = useUser();
  const { id } = useParams();

  const { myRoleData, isLoading, isAdmin } = useGetMyRoleInGroup(id);

  const { groupData, isGroupLoading } = useGetAGroupData(id);
  const { groupBalanceData: groupBalance, isGroupBalnceLoading } =
    useGetGroupExpensesAndSettlements(id);
  console.log(groupBalance);
  let expenseData = [];
  const { groupExpenseData, isGroupExpenseLoading } =
    useGetAllExpensesOfAGroup(id);
  console.log(groupExpenseData);

  groupExpenseData?.map((ge) => {
    expenseData.push({
      id: ge?._id,
      description: ge?.description,
      amount: ge?.amount,

      paidBy: ge.paidBy.map((p) => p.userId.name).join(", "),

      date: ge?.date?.split("T")[0],

      splitBetween: ge?.splitAmong?.filter((split) => split.amount !== 0)
        .length,
      isThisExpenseCreatedByMe: ge?.createdBy == user?.id,
    });
  });

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${groupBalance?.groupName}-summary`,
  });

  if (!isSignedIn) return <Navigate to="/" />;

  if (
    isLoading ||
    isGroupLoading ||
    isGroupExpenseLoading ||
    isGroupBalnceLoading
  )
    return <LoaderPage />;

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
                  {groupData?.members.length || 0} members -{" "}
                  {groupData?.members?.map((m) => m.name).join(", ")}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* View Balance Button - Available to all */}
          <button
            className="btn btn-outline border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 flex items-center justify-center gap-2"
            onClick={() => {
              /* Add your view balance logic */
              setShowBalanceModal(true);
            }}
          >
            <Scale className="w-4 h-4" />
            View Balance
          </button>

          {/* Print Summary Button - Available to all */}
          <button
            className="btn btn-outline border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600 flex items-center justify-center gap-2"
            onClick={handlePrint}
            disabled={isGroupBalnceLoading || !groupBalance}
          >
            <FileText className="w-4 h-4" />
            Print Summary
          </button>

          {/* Admin Only Buttons */}
          {isAdmin && (
            <>
              <button
                className="btn btn-outline border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 flex items-center justify-center gap-2"
                onClick={() => setShowInviteLinkModal(true)}
              >
                <Link2 className="w-4 h-4" />
                Invite Link
              </button>
              <button
                className="btn btn-outline border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 flex items-center justify-center gap-2"
                onClick={() => setShowDeleteGroupModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Group
              </button>
            </>
          )}
        </div>

        {/* Recent Expenses Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Recent Expenses
          </h2>

          {/* Expenses List */}
          <div className="space-y-4">
            {expenseData.length > 0 ? (
              expenseData.map((expense) => (
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

                  {expense.isThisExpenseCreatedByMe && (
                    <button
                      className="ml-4 btn btn-ghost btn-sm btn-circle text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setExpenseId(expense.id);
                        setShowDeleteExpenseModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
        <InvitationModal
          id={id}
          setShowInviteLinkModal={setShowInviteLinkModal}
        />
      )}
      {/* Delete Group Modal */}
      {showDeleteGroupModal && (
        <DeleteModal
          setShowDeleteGroupModal={setShowDeleteGroupModal}
          id={id}
        />
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <AddExpenseModal
          setShowAddExpenseModal={setShowAddExpenseModal}
          id={id}
        />
      )}
      {/* Delete Expense Modal */}
      {showDeleteExpenseModal && (
        <DeleteExpenseModal
          setShowDeleteExpenseModal={setShowDeleteExpenseModal}
          groupId={id}
          id={expenseId}
        />
      )}
      {/* Group Balance Modal */}
      <GroupBalanceModal
        showModal={showBalanceModal}
        setShowModal={setShowBalanceModal}
        id={id}
      />
      {/* Printable Summary (must stay mounted) */}
      {groupBalance && (
        <div className="hidden">
          <PrintableSummary ref={printRef} groupBalance={groupBalance} />
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
